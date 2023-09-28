import requests
import sys

from PIL import Image, ImageFilter
from io import BytesIO

def apply_filters(image_url, filter):
    if not image_url:
        print("Image URL is not provided.")
        return

    if not filter:
        print("Filter is not provided.")
        return

    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))
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
    # The URL for image must be public and accessible
    image_url = sys.argv[1]
    img_filter = sys.argv[2]
    
    filtered_img = apply_filters(image_url, filter=img_filter)
    filename = "/data/outputs/filtered_image.png"
    print(f"Filters applied and images saved successfully as {filename}")
    filtered_img.save(filename)