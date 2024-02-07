import json
import csv
import yaml
import xmltodict
import pandas as pd
import os
import glob

def read_file(file_path):
    if file_path.endswith('.txt'):
        with open(file_path, 'r') as file:
            content = file.read()
        return content

    elif file_path.endswith('.xml'):
        with open(file_path, 'r') as file:
            content = xmltodict.parse(file.read())
        return content

    elif file_path.endswith('.yaml') or file_path.endswith('.yml'):
        with open(file_path, 'r') as file:
            content = yaml.safe_load(file)
        return content

    elif file_path.endswith('.json'):
        with open(file_path, 'r') as file:
            content = json.load(file)
        return content

    elif file_path.endswith('.csv'):
        content = pd.read_csv(file_path)
        return content.to_dict()

    else:
        return None

file_patterns = ['*.txt', '*.xml', '*.yaml', '*.yml', '*.json', '*.csv']

for pattern in file_patterns:
    for file_path in glob.glob(pattern):
        parsed_content = read_file(file_path)
        if parsed_content is not None:
            print(f"{file_path}:")
            print(parsed_content)
        else:
            print(f"Skipped unsupported file format: {file_path}")
