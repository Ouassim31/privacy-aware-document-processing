import json
import os


iexec_out = os.environ['IEXEC_OUT']
iexec_in = os.environ['IEXEC_IN']
dataset_filename = os.environ['IEXEC_DATASET_FILENAME']

# read income from dataset file
try:
    dataset_file = open(iexec_in + '/' + dataset_filename, 'r')
    dataset = dataset_file.read()
    income = int(dataset.split()[1])
except OSError:
    print('Confidential file does not exists.')
    exit(1)
except ValueError:
    print('First line of .txt dataset needs to be income: <income>')
    exit(1)

# get rent from requester secret 1
try:
    rent = int(os.environ["IEXEC_REQUESTER_SECRET_1"])
except Exception:
    print('Missing requester secret <rent>.')
    exit(1)

result = ""
if income > 3 * rent:
    result = "Tenant makes enough money."
else:
    result = "Tenant does not make enough money."


# Append results in /iexec_out/
with open(iexec_out + '/result.txt', 'w+') as fout:
    fout.write(result)

# Declare everything is computed
with open(iexec_out + '/computed.json', 'w+') as f:
    json.dump({"deterministic-output-path": iexec_out + '/result.txt'}, f)