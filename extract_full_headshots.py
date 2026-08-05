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

# Setting Y_start to 0.18 captures the FULL top of head and hair without any top crop!
members_map = [
    (16, [
        ("namash.jpg", 0.05, 0.26, 0.18, 0.76),
        ("yash.jpg", 0.28, 0.49, 0.18, 0.76),
        ("maya.jpg", 0.51, 0.72, 0.18, 0.76),
        ("yogita.jpg", 0.74, 0.95, 0.18, 0.76)
    ]),
    (17, [
        ("Om.jpg", 0.05, 0.26, 0.18, 0.76),
        ("karthik.jpg", 0.28, 0.49, 0.18, 0.76),
        ("Anish.jpg", 0.51, 0.72, 0.18, 0.76),
        ("Pravesh.jpg", 0.74, 0.95, 0.18, 0.76)
    ]),
    (18, [
        ("om nerkar.jpg", 0.05, 0.26, 0.18, 0.76),
        ("a.jpg", 0.28, 0.49, 0.18, 0.76),
        ("khushi.jpg", 0.51, 0.72, 0.18, 0.76),
        ("Anay.jpg", 0.74, 0.95, 0.18, 0.76)
    ]),
    (19, [
        ("Mehwish.jpg", 0.05, 0.26, 0.18, 0.76),
        ("aarya.jpg", 0.28, 0.49, 0.18, 0.76),
        ("khushi_nanekar.jpg", 0.51, 0.72, 0.18, 0.76),
        ("Prakruti.jpg", 0.74, 0.95, 0.18, 0.76)
    ])
]

# Scale factor 3x for crisp resolution
zoom = 3.0
mat = fitz.Matrix(zoom, zoom)

for page_num, targets in members_map:
    page = doc[page_num]
    pix = page.get_pixmap(matrix=mat, alpha=False)
    
    temp_slide_path = f"temp_slide_{page_num+1}.png"
    pix.save(temp_slide_path)
    
    with Image.open(temp_slide_path) as slide_img:
        W, H = slide_img.size
        print(f"\n--- Processing Slide {page_num+1} ({W}x{H}) ---")
        
        for filename, x_start, x_end, y_start, y_end in targets:
            left = int(W * x_start)
            right = int(W * x_end)
            top = int(H * y_start)
            bottom = int(H * y_end)
            
            cropped = slide_img.crop((left, top, right, bottom))
            out_filepath = os.path.join(output_dir, filename)
            cropped.save(out_filepath, quality=95)
            print(f"Full headshot extracted: {filename} -> {cropped.width}x{cropped.height}")
            
    if os.path.exists(temp_slide_path):
        os.remove(temp_slide_path)

print("\nAll 16 member full headshots extracted successfully!")
