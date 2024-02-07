# pip install xmltodict pyyaml
# python script.py
import json
import csv
import yaml
import xmltodict
import os
import glob

def read_txt(file):
    return file.read()

def read_xml(file):
    return xmltodict.parse(file.read())

def read_yaml(file):
    return yaml.safe_load(file)

def read_json(file):
    return json.load(file)

def read_csv(file):
    reader = csv.DictReader(file)
    return list(reader)

file_handler = {
    '.txt': read_txt,
    '.xml': read_xml,
    '.yaml': read_yaml,
    '.yml': read_yaml,
    '.json': read_json,
    '.csv': read_csv
}

def read_file(file_path):
    file_type = os.path.splitext(file_path)[1].lower()
    if file_type in file_handler:
        with open(file_path) as file:
            return file_handler[file_type](file)
    return None

def main():
    exclude_file = {'package.json', 'package-lock.json', 'node_modules'}
    file_pattern = ['*.txt', '*.xml', '*.yaml', '*.yml', '*.json', '*.csv']

    for pattern in file_pattern:
        for file_path in glob.glob(pattern, recursive=True):
            if any(exclude in file_path for exclude in exclude_file):
                continue
            
            parsed_content = read_file(file_path)
            if parsed_content is not None:
                print(f"{file_path}:")
                print(parsed_content)

main()
