import json
import os
import PyPDF2


keywords = ["nettoentgelt", "income", "überweisung"]


def analyze_payslip(text, rent):
    text = str.lower(text)
    word_list = text.split()

    for key in keywords:
        for i, word in enumerate(word_list):
            if word == key:
                # check if word to the right of keyword is a number
                net_income = convert_to_float(word_list[i + 1])
                if net_income > 0:
                    return makes_enough_money(net_income, rent)

    return "Could not determine tenant's income from pdf file."


def convert_to_float(str_in):
    ## expects format 1.000,00
    str_in = str_in.replace('.', '')
    str_in = str_in.replace(',', '.')
    try:
        float_out = float(str_in)
        return float_out
    except ValueError:
        return -1


def makes_enough_money(income, rent):
    if 3 * rent < income:
        return "Tenant's income of " + str(income) + " is higher than 3 times the rent of " + str(rent)
    else:
        return "Tenant's income of " + str(income) + " is lower than 3 times the rent of " + str(rent)


def get_document_text(pdf_file):
    pdf_reader = PyPDF2.PdfFileReader(pdf_file)
    document_text = ""

    for page in range(pdf_reader.numPages):
        document_text += pdf_reader.getPage(page).extractText()

    if len(document_text) > 0:
        print("Extracted document text from pdf.")
    
    return document_text


def main():
    iexec_out = os.environ['IEXEC_OUT']
    iexec_in = os.environ['IEXEC_IN']
    dataset_filename = os.environ['IEXEC_DATASET_FILENAME']
    pdf_file = ""

    # get dataset
    try:
        pdf_file = open(iexec_in + '/' + dataset_filename, 'rb')
    except OSError:
        print('confidential file does not exists')
        exit(1)

    # get rent from requester secret 1
    try:
        rent = int(os.environ["IEXEC_REQUESTER_SECRET_1"])
    except Exception:
        print('Missing requester secret <rent>.')
        exit(1)

    document_text = get_document_text(pdf_file)
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
