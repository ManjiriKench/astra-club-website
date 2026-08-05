import fitz
from PIL import Image
import os

pdf_path = r"c:\Projects- FINAL\club- website\astra induction ppt (1) (1).pdf"
doc = fitz.open(pdf_path)

output_dir = r"c:\Projects- FINAL\club- website"

# Slide 17: Namash Kate, Yash Lund, Mayank Patil, Prof. Yogita Patil
# Slide 18: Om Dangi, Karthik Kurup, Anish Pathak, Pravesh Jain
# Slide 19: Om Nerkar, Manjiri Kench, Khushi Thakkar, Anay Khatpe
# Slide 20: Mehwish Tabbassum, Arya Nagraj, Khushi Nanekar, Prakruti Pipaliya

members_map = [
    (16, [
        ("namash.jpg", 0.07, 0.28, 0.25, 0.72),
        ("yash.jpg", 0.29, 0.50, 0.25, 0.72),
        ("maya.jpg", 0.51, 0.72, 0.25, 0.72),
        ("yogita.jpg", 0.73, 0.94, 0.25, 0.72)
    ]),
    (17, [
        ("Om.jpg", 0.07, 0.28, 0.25, 0.72),
        ("karthik.jpg", 0.29, 0.50, 0.25, 0.72),
        ("Anish.jpg", 0.51, 0.72, 0.25, 0.72),
        ("Pravesh.jpg", 0.73, 0.94, 0.25, 0.72)
    ]),
    (18, [
        ("om nerkar.jpg", 0.07, 0.28, 0.25, 0.72),
        ("a.jpg", 0.29, 0.50, 0.25, 0.72),
        ("khushi.jpg", 0.51, 0.72, 0.25, 0.72),
        ("Anay.jpg", 0.73, 0.94, 0.25, 0.72)
    ]),
    (19, [
        ("Mehwish.jpg", 0.07, 0.28, 0.25, 0.72),
        ("aarya.jpg", 0.29, 0.50, 0.25, 0.72),
        ("khushi_nanekar.jpg", 0.51, 0.72, 0.25, 0.72),
        ("Prakruti.jpg", 0.73, 0.94, 0.25, 0.72)
    ])
]

# High DPI matrix for razor-sharp rendering
zoom = 3.0 # 3x scale factor
mat = fitz.Matrix(zoom, zoom)

for page_num, targets in members_map:
    page = doc[page_num]
    pix = page.get_pixmap(matrix=mat, alpha=False)
    
    # Save temp slide render
    temp_slide_path = f"temp_slide_{page_num+1}.png"
    pix.save(temp_slide_path)
    
    with Image.open(temp_slide_path) as slide_img:
        W, H = slide_img.size
        print(f"\n--- Slide {page_num+1} Rendered: {W}x{H} ---")
        
        for filename, x_start, x_end, y_start, y_end in targets:
            left = int(W * x_start)
            right = int(W * x_end)
            top = int(H * y_start)
            bottom = int(H * y_end)
            
            cropped = slide_img.crop((left, top, right, bottom))
            out_filepath = os.path.join(output_dir, filename)
            cropped.save(out_filepath, quality=95)
            print(f"Extracted and saved: {filename} ({cropped.width}x{cropped.height})")
            
    if os.path.exists(temp_slide_path):
        os.remove(temp_slide_path)

print("\nAll 16 PPT member photos extracted successfully!")
