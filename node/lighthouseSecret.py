import json
import os

SECRET_CONSTANT = "0123456789.eth"

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def create_secrets_directory(file_path):
    # Get parent directory of the current directory
    parent_dir = os.path.dirname(os.path.dirname(file_path))
    secrets_dir = os.path.join(parent_dir, 'validator_keys_secrets')
    if not os.path.exists(secrets_dir):
        os.makedirs(secrets_dir)
    return secrets_dir

def create_secret_files(pubkeys, secrets_dir, file_name):
    for pubkey in pubkeys:
        secret_file_name = f'0x{pubkey}'
        file_path = os.path.join(secrets_dir, secret_file_name)
        with open(file_path, 'w') as file:
            file.write(SECRET_CONSTANT)

def main(file_path):
    if not os.path.isfile(file_path):
        print(f"The file {file_path} does not exist.")
        return

    data = read_json_file(file_path)
    pubkeys = [item['pubkey'] for item in data]

    file_name = os.path.splitext(os.path.basename(file_path))[0]
    secrets_dir = create_secrets_directory(file_path)
    create_secret_files(pubkeys, secrets_dir, file_name)

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python script.py <file_path>")
    else:
        file_path = sys.argv[1]
        main(file_path)