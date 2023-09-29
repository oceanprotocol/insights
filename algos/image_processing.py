import os
import json
from PIL import Image, ImageFilter


def get_filename():
    dids = os.getenv("DIDS", None)

    if not dids:
        print("No DIDs found in environment. Aborting.")
        return

    dids = json.loads(dids)

    for did in dids:
        filename = f"data/inputs/{did}/0"  # 0 for metadata service
        print(f"Reading asset file {filename}.")

        return filename


def apply_filters(filter):
    if not filter:
        print("Filter is not provided.")
        return

    filename = get_filename()
    img = Image.open(filename)
    filtered_img = None

    # Apply filter
    if filter == "blur":
        blurred_img = img.filter(ImageFilter.GaussianBlur(radius=5))
        filtered_img = blurred_img
    elif filter == "grayscale":
        grayscale_img = img.convert("L")
        filtered_img = grayscale_img
    elif filter == "unsharp":
        unsharp_img = img.filter(ImageFilter.UnsharpMask(radius=5))
        filtered_img = unsharp_img
    else:
        print("Unknown filter.")
        return

    return filtered_img


if __name__ == "__main__":
    # Open and read the JSON file
    with open("/data/inputs/algoCustomData.json", "r") as file:
        data = json.load(file)

    print(f"data for consumer parameters: {data}")
    filtered_img = apply_filters(filter=data["image_filter"])
    filename = "/data/outputs/filtered_image.png"
    filtered_img.save(filename)
    print(f"Filters applied and images saved successfully as {filename}")
