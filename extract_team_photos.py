import fitz # PyMuPDF
import os
from PIL import Image

pdf_path = r"c:\Projects- FINAL\club- website\astra induction ppt (1) (1).pdf"
doc = fitz.open(pdf_path)

output_dir = r"c:\Projects- FINAL\club- website\extracted_ppt_photos"
os.makedirs(output_dir, exist_ok=True)

print(f"Total pages in PDF: {len(doc)}")

# Team slides are pages 17, 18, 19, 20 (10-indexed: 16, 17, 18, 19)
team_pages = [16, 17, 18, 19]

for p_index in team_pages:
    page = doc[p_index]
    image_list = page.get_images(full=True)
    print(f"\n--- Page {p_index + 1}: Found {len(image_list)} images ---")
    
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        filename = f"page_{p_index+1}_img_{img_idx+1}.{image_ext}"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        
        # Open with Pillow to get dimensions
        with Image.open(filepath) as pil_img:
            w, h = pil_img.size
            print(f"Saved {filename} | Size: {w}x{h} | Ext: {image_ext}")
