from PIL import Image
import pytesseract
import io



def extract_text(image_bytes):
    """
    Extracts text from the given image and returns it as a string.
    """

    image = Image.open(io.BytesIO(image_bytes))
    text = pytesseract.image_to_string(image)
    return text



