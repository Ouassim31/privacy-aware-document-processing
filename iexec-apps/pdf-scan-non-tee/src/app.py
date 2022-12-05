import json
import os
import sys
import PyPDF2
from pdf2image import convert_from_path
import cv2
import pytesseract


keywords = ["nettoentgelt", "INCOME", "überweisung"]


def save_page_images():
    pages = convert_from_path('income-image.pdf', 350)

    i = 1
    for page in pages:
        image_name = "images/Page_" + str(i) + ".jpg"
        page.save(image_name, "JPEG")
        i = i + 1

    return i


def extract_text(image_path):
    # load the original image
    image = cv2.imread(image_path)

    # convert the image to black and white for better OCR
    ret, thresh1 = cv2.threshold(image, 120, 255, cv2.THRESH_BINARY)

    # pytesseract image to string to get results
    return str(pytesseract.image_to_string(thresh1, config='--psm 6'))


def analyze_payslip(text, rent):
    text = str.lower(text)
    word_list = text.split()

    for key in keywords:

        for i, word in enumerate(word_list):
            if word == key:
                net_income = convert_to_float(word_list[i + 1])
                if net_income > 0:
                    return makes_enough_money(net_income, rent)

    return -1


def makes_enough_money(income, rent):
    if 3 * rent < income:
        return "Tenant's income of " + str(income) + " is higher than 3 times the rent of " + str(rent)
    else:
        return "Tenant's income of " + str(income) + " is lower than 3 times the rent of " + str(rent)


def convert_to_float(str_in):
    ## expects format 1.000,00
    str_in = str_in.replace('.', '')
    str_in = str_in.replace(',', '.')
    try:
        float_out = float(str_in)
        return float_out
    except ValueError:
        return -1


def main():
    iexec_out = os.environ['IEXEC_OUT']
    iexec_in = os.environ['IEXEC_IN']
    dataset_filename = os.environ['IEXEC_INPUT_FILE_NAME_1']
    rent = int(sys.argv[1])
    pdf_file = ""

    try:
        pdf_file = open(iexec_in + '/' + dataset_filename, 'rb')
    except OSError:
        print('confidential file does not exists')
        exit(1)

    pdf_reader = PyPDF2.PdfFileReader(pdf_file)
    document_text = ""

    for page in range(pdf_reader.numPages):
        document_text += pdf_reader.getPage(page).extractText()

    if len(document_text) > 0:
        print("Extracted document text from pdf.")

    if document_text == "":
        img_count = save_page_images()
        for i in range(1, img_count):
            document_text += extract_text('images/Page_' + str(i) + '.jpg')

        if len(document_text) > 0:
            print("Extracted document text from image.")

    result = analyze_payslip(document_text, rent)

    pdf_file.close()

    # Append results in /iexec_out/
    with open(iexec_out + '/result.txt', 'w+') as fout:
        fout.write(result)

    # Declare everything is computed
    with open(iexec_out + '/computed.json', 'w+') as f:
        json.dump({"deterministic-output-path": iexec_out + '/result.txt'}, f)


if __name__ == "__main__":
    main()
