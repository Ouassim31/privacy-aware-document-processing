import os
import sys
import json


try:
    iexec_out = os.environ['IEXEC_OUT']

    # get the secret endpoint from requester secrets
    try:
        rent = int(os.environ["IEXEC_REQUESTER_SECRET_1"])
    except Exception:
        print("missing requester secret 1 (rent)")
        exit(1)
    try:
        monthly_income = int(os.environ["IEXEC_REQUESTER_SECRET_2"])
    except Exception:
        print("missing requester secret 2 (monthly inocme)")
        exit(1)

    text = ""
    if monthly_income >= 3 * rent:
        text = "Tenant makes more than three times the rent of " + str(rent)
    else:
        text = "Tenant makes less than three times the rent of" + str(rent)

    print(text)

    # Append some results in /iexec_out/
    with open(iexec_out + '/result.txt', 'w+') as fout:
        fout.write(text)

    # Declare everything is computed
    with open(iexec_out + '/computed.json', 'w+') as f:
        json.dump({ "deterministic-output-path" : iexec_out + '/result.txt' }, f)

except Exception:
    print("something went wrong")
    exit(1)

