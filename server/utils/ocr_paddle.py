import sys
import json

def run_paddle_ocr(image_path):
    try:
        from paddleocr import PaddleOCR
        # Initialize PaddleOCR engine (English language model)
        ocr = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
        result = ocr.ocr(image_path, cls=True)
        
        text_lines = []
        if result and result[0]:
            for line in result[0]:
                text_lines.append(line[1][0])
                
        extracted_text = " ".join(text_lines)
        print(json.dumps({"success": True, "text": extracted_text}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        run_paddle_ocr(sys.argv[1])
    else:
        print(json.dumps({"success": False, "error": "No image path provided"}))
