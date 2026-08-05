import os
from PIL import Image

photo_files = [
    "namash.jpg", "yash.jpg", "maya.jpg", "yogita.jpg",
    "Om.jpg", "karthik.jpg", "Anish.jpg", "Pravesh.jpg",
    "om nerkar.jpg", "a.jpg", "khushi.jpg", "Anay.jpg",
    "Mehwish.jpg", "aarya.jpg", "khushi_nanekar.jpg", "Prakruti.jpg"
]

base_dir = r"c:\Projects- FINAL\club- website"

for filename in photo_files:
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with Image.open(filepath) as img:
            W, H = img.size
            # Crop photo box area (top 15% to 75% of card)
            top = int(H * 0.14)
            bottom = int(H * 0.76)
            left = int(W * 0.03)
            right = int(W * 0.97)
            
            cropped = img.crop((left, top, right, bottom))
            cropped.save(filepath, quality=95)
            print(f"Cropped headshot: {filename} -> {cropped.width}x{cropped.height}")

print("All 16 member headshots cropped cleanly!")
