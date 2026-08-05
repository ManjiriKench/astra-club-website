import fitz

pdf_path = r"c:\Projects- FINAL\club- website\astra induction ppt (1) (1).pdf"
doc = fitz.open(pdf_path)

team_pages = [
    (16, "Page 17: Namash Kate, Yash Lund, Mayank Patil, Prof. Yogita Patil"),
    (17, "Page 18: Om Dangi, Karthik Kurup, Anish Pathak, Pravesh Jain"),
    (18, "Page 19: Om Nerkar, Manjiri Kench, Khushi Thakkar, Anay Khatpe"),
    (19, "Page 20: Mehwish Tabbassum, Arya Nagraj, Khushi Nanekar, Prakruti Pipaliya")
]

for p_index, desc in team_pages:
    page = doc[p_index]
    print(f"\n================ {desc} ================")
    image_rects = []
    
    # Get image drawing locations
    for img_info in page.get_images(full=True):
        xref = img_info[0]
        # find rect for this xref
        rects = page.get_image_rects(xref)
        for r in rects:
            image_rects.append((r.x0, r.y0, r.x1, r.y1, xref))
    
    # Sort left to right by x0
    image_rects.sort(key=lambda item: item[0])
    
    for idx, (x0, y0, x1, y1, xref) in enumerate(image_rects):
        w = x1 - x0
        h = y1 - y0
        # Only photos (width > 50 and height > 50 and not tiny logo)
        if w > 40 and h > 40 and x0 > 10: # avoid top-left header logo
            print(f"Pos {idx+1} | X0: {x0:.1f}, Y0: {y0:.1f} | Width: {w:.1f}, Height: {h:.1f} | xref: {xref}")
