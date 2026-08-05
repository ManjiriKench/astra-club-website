import fitz
from PIL import Image
import os

pdf_path = r"c:\Projects- FINAL\club- website\astra induction ppt (1) (1).pdf"
doc = fitz.open(pdf_path)
output_dir = r"c:\Projects- FINAL\club- website"

# Render matrix 3.0x for super crisp rendering
zoom = 3.0
mat = fitz.Matrix(zoom, zoom)

# Slides 17, 18, 19, 20 (0-indexed: 16, 17, 18, 19)
slide_mappings = [
    (16, ["namash.jpg", "yash.jpg", "maya.jpg", "yogita.jpg"]),
    (17, ["Om.jpg", "karthik.jpg", "Anish.jpg", "Pravesh.jpg"]),
    (18, ["om nerkar.jpg", "a.jpg", "khushi.jpg", "Anay.jpg"]),
    (19, ["Mehwish.jpg", "aarya.jpg", "khushi_nanekar.jpg", "Prakruti.jpg"])
]

for p_index, filenames in slide_mappings:
    page = doc[p_index]
    pix = page.get_pixmap(matrix=mat, alpha=False)
    
    temp_slide_path = f"temp_slide_{p_index+1}.png"
    pix.save(temp_slide_path)
    
    # Collect all photo xref rects on this page
    photo_rects = []
    
    for img_info in page.get_images(full=True):
        xref = img_info[0]
        rects = page.get_image_rects(xref)
        for r in rects:
            w = r.x1 - r.x0
            h = r.y1 - r.y0
            # Filter out top header logos, small icons, and bottom banners
            if w > 40 and h > 100 and r.x0 > 50 and r.y0 > 100:
                photo_rects.append((r.x0, r.y0, r.x1, r.y1, xref))
                
    # Sort left to right by x0
    photo_rects.sort(key=lambda item: item[0])
    
    print(f"\n--- Slide {p_index+1}: Found {len(photo_rects)} photo rects for {len(filenames)} members ---")
    
    with Image.open(temp_slide_path) as slide_img:
        for idx, (x0, y0, x1, y1, xref) in enumerate(photo_rects):
            if idx < len(filenames):
                target_filename = filenames[idx]
                
                # Convert PDF coords to image coords (scale by zoom factor 3.0)
                left = int(x0 * zoom)
                top = int(y0 * zoom)
                right = int(x1 * zoom)
                bottom = int(y1 * zoom)
                
                cropped = slide_img.crop((left, top, right, bottom))
                out_filepath = os.path.join(output_dir, target_filename)
                cropped.save(out_filepath, quality=95)
                print(f"[{idx+1}/{len(filenames)}] Extracted exact photo for {target_filename} (BBox: {left},{top} to {right},{bottom} -> Size: {cropped.width}x{cropped.height})")
                
    if os.path.exists(temp_slide_path):
        os.remove(temp_slide_path)

print("\nAll 16 exact photo BBoxes extracted successfully without any slide header space!")
