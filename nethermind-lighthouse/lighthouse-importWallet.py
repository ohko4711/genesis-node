import json
import os
import glob

SECRET_CONSTANT = "0123456789.eth"

def read_json_file(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except json.JSONDecodeError:
        print(f"Warning: Skipping invalid JSON file: {file_path}")
        return None
    except Exception as e:
        print(f"Warning: Error reading file {file_path}: {e}")
        return None

def create_secrets_directory(dir_path):
    base_name = os.path.basename(os.path.normpath(dir_path))
    secrets_dir = os.path.join(os.path.dirname(dir_path), f'{base_name}_secrets')
    if not os.path.exists(secrets_dir):
        os.makedirs(secrets_dir)
    return secrets_dir

def create_secret_files(pubkeys, secrets_dir):
    for pubkey in pubkeys:
        if not isinstance(pubkey, str):
            print(f"Warning: Skipping invalid pubkey data type: {type(pubkey)}")
            continue
        if pubkey.startswith('0x'):
            pubkey = pubkey[2:]
        secret_file_name = f'0x{pubkey}'
        file_path = os.path.join(secrets_dir, secret_file_name)
        try:
            with open(file_path, 'w') as file:
                file.write(SECRET_CONSTANT)
        except IOError as e:
            print(f"Error writing secret file {file_path}: {e}")

def main(dir_path):
    if not os.path.isdir(dir_path):
        print(f"The directory {dir_path} does not exist.")
        return

    pubkeys = []
    json_files = glob.glob(os.path.join(dir_path, '*.json'))

    if not json_files:
        print(f"No JSON files found in directory: {dir_path}")
        return

    for file_path in json_files:
        data = read_json_file(file_path)
        if data and 'pubkey' in data:
            pubkeys.append(data['pubkey'])
        elif data:
            print(f"Warning: 'pubkey' not found in {file_path}")

    if not pubkeys:
        print(f"No public keys found in any JSON files within {dir_path}.")
        return

    secrets_dir = create_secrets_directory(dir_path)
    create_secret_files(pubkeys, secrets_dir)
    print(f"Successfully created {len(pubkeys)} secret files in {secrets_dir}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python script.py <directory_path>")
    else:
        dir_path = sys.argv[1]
        main(dir_path)
