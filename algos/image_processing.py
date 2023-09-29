import json
from PIL import Image, ImageFilter

def apply_filters(did, filter):
    if not did:
        print("DID is not provided.")
        return

    if not filter:
        print("Filter is not provided.")
        return

    filename = f"data/inputs/{did}/0"
    img = Image.open(filename)
    filtered_img = None

    # Apply filter
    if filter == 'blur':
        blurred_img = img.filter(ImageFilter.GaussianBlur(radius=5))
        filtered_img = blurred_img
    elif filter == 'grayscale':
        grayscale_img = img.convert("L")
        filtered_img = grayscale_img
    elif filter == 'unsharp':
        unsharp_img = img.filter(ImageFilter.UnsharpMask(radius=5))
        filtered_img = unsharp_img
    else:
        print("Unknown filter.")
        return
    
    return filtered_img

if __name__ == "__main__":
    # Open and read the JSON file
    with open('/data/inputs/algoCustomData.json', 'r') as file:
        data = json.load(file)
    print (f"data for consumer parameters: {data}")
    filtered_img = apply_filters(data['did'], filter=data['image_filter'])
    filename = "/data/outputs/filtered_image.png"
    filtered_img.save(filename)
    print(f"Filters applied and images saved successfully as {filename}")