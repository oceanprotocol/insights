from PIL import Image, ImageFilter
import requests
from io import BytesIO

def apply_filters(image_url, filter, save_path='output/'):
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))

    # Apply filter
    if filter == 'blur':
        blurred_img = img.filter(ImageFilter.GaussianBlur(radius=5))
        blurred_img.save(save_path + "blurred.png")
    elif filter == 'grayscale':
        grayscale_img = img.convert("L")
        grayscale_img.save(save_path + "grayscale.png")
    elif filter == 'unsharp':
        unsharp_img = img.filter(ImageFilter.UnsharpMask(radius=5))
        unsharp_img.save(save_path + "unsharp_mask.png")
    else:
        print("Unknown filter.")
    
    return

if __name__ == "__main__":
    # The URL for image must be public and accessible
    image_url = input("Enter the URL of the image: ")
    img_filter = input("Enter the filter for the image: ")

    apply_filters(image_url, filter=img_filter)
    print("Filters applied and images saved successfully.")
