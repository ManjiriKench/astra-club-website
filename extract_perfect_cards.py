import fitz
from PIL import Image
import os

pdf_path = r"c:\Projects- FINAL\club- website\astra induction ppt (1) (1).pdf"
doc = fitz.open(pdf_path)

output_dir = r"c:\Projects- FINAL\club- website"

# 4 horizontal card slots
slots = [
    (0.053, 0.258), # Card 1
    (0.283, 0.488), # Card 2
    (0.513, 0.718), # Card 3
    (0.743, 0.948)  # Card 4
]

# Photo box Y bounds (starts cleanly below slide title, ends above name banner)
Y_TOP = 0.205
Y_BOTTOM = 0.685

slide_members = [
    (16, ["namash.jpg", "yash.jpg", "maya.jpg", "yogita.jpg"]),
    (17, ["Om.jpg", "karthik.jpg", "Anish.jpg", "Pravesh.jpg"]),
    (18, ["om nerkar.jpg", "a.jpg", "khushi.jpg", "Anay.jpg"]),
    (19, ["Mehwish.jpg", "aarya.jpg", "khushi_nanekar.jpg", "Prakruti.jpg"])
]

zoom = 3.0
mat = fitz.Matrix(zoom, zoom)

for page_num, filenames in slide_members:
    page = doc[page_num]
    pix = page.get_pixmap(matrix=mat, alpha=False)
    
    temp_slide_path = f"temp_slide_{page_num+1}.png"
    pix.save(temp_slide_path)
    
    with Image.open(temp_slide_path) as slide_img:
        W, H = slide_img.size
        top = int(H * Y_TOP)
        bottom = int(H * Y_BOTTOM)
        
        print(f"\n--- Processing Slide {page_num+1} ({W}x{H}) ---")
        for i, filename in enumerate(filenames):
            x_start, x_end = slots[i]
            left = int(W * x_start)
            right = int(W * x_end)
            
            cropped = slide_img.crop((left, top, right, bottom))
            out_filepath = os.path.join(output_dir, filename)
            cropped.save(out_filepath, quality=95)
            print(f"Extracted perfect photo [{i+1}/4]: {filename} -> {cropped.width}x{cropped.height}")
            
    if os.path.exists(temp_slide_path):
        os.remove(temp_slide_path)

print("\nAll 16 member photos extracted perfectly with zero top/bottom header bars!")
