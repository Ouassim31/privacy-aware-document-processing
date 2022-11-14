import os
import sys
import json


iexec_out = os.environ['IEXEC_OUT']
rent = int(sys.argv[1])
monthly_income = int(sys.argv[2])

print("RENT: " + str(rent))
print("MONTHLY INCOME: " + str(monthly_income))

## Simple computation for deemo
text = ""
if monthly_income >= 3 * rent:
    text = "Tenant makes more than three times the rent of " + str(rent)
else:
    text = "Tenant makes less than three times the rent of " + str(rent)

print(text)

## Append some results in /iexec_out/
with open(iexec_out + '/result.txt', 'w+') as fout:
    fout.write(text)

# Declare everything is computed
with open(iexec_out + '/computed.json', 'w+') as f:
    json.dump({ "deterministic-output-path" : iexec_out + '/result.txt' }, f)