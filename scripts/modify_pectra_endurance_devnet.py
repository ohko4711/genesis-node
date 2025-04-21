#!/usr/bin/env python3
import json
import shutil
import os
import argparse

PRAGUE_EPOCH = 1
GENESIS_TIME = 1745217000
PECTRA_TIME = GENESIS_TIME + PRAGUE_EPOCH * 32 * 12
DEPOSIT_CONTRACT_ADDRESS = "0x6f22fFbC56eFF051aECF839396DD1eD9aD6BBA9D"
DEFAULT_CONFIG_DIR = "../el-cl-genesis-data/metadata"

def update_json_file(file_path, update_function):
    """Generic function to update a JSON file with backup"""
    # Extract filename from path
    filename = os.path.basename(file_path)
    backup_file_path = file_path.replace(filename, f"{os.path.splitext(filename)[0]}_prague_backup.json")
    temp_output_path = file_path.replace(filename, f"{os.path.splitext(filename)[0]}_temp.json")
    
    print(f"Processing {file_path}...")
    # Backup the original file
    shutil.copy(file_path, backup_file_path)
    print(f"Backup created at {backup_file_path}")
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as input_file:
        data = json.load(input_file)
    
    # Apply the update function
    data = update_function(data)
    
    # Write to temporary file
    with open(temp_output_path, 'w', encoding='utf-8') as temp_file:
        json.dump(data, temp_file, indent=4)
    
    # Replace the original file
    os.replace(temp_output_path, file_path)
    print(f"Updated {file_path}")

def update_besu_json(config_dir):
    """Update besu.json with Prague time and blob schedule"""
    def update_function(data):
        # Add pragueTime
        data['config']['pragueTime'] = PECTRA_TIME
        data['config']['depositContractAddress'] = DEPOSIT_CONTRACT_ADDRESS
        # Add blobSchedule config
        data['config']['blobSchedule'] = {
            "cancun": {
                "target": 3,
                "max": 6,
                "baseFeeUpdateFraction": 3338477
            },
            "prague": {
                "target": 6,
                "max": 9,
                "baseFeeUpdateFraction": 5007716
            }
        }
        # TODO: temp 
        data['timestamp'] = GENESIS_TIME
        return data
    
    file_path = os.path.join(config_dir, "besu.json")
    update_json_file(file_path, update_function)

def update_genesis_json(config_dir):
    """Update genesis.json with Prague time and blob schedule"""
    def update_function(data):
        # Add pragueTime
        data['config']['pragueTime'] = PECTRA_TIME
        data['config']['depositContractAddress'] = DEPOSIT_CONTRACT_ADDRESS
        
        # Add blobSchedule config
        data['config']['blobSchedule'] = {
            "cancun": {
                "target": 3,
                "max": 6,
                "baseFeeUpdateFraction": 3338477
            },
            "prague": {
                "target": 6,
                "max": 9,
                "baseFeeUpdateFraction": 5007716
            }
        }
        # TODO: temp 
        data['timestamp'] = GENESIS_TIME
        return data
    
    file_path = os.path.join(config_dir, "genesis.json")
    update_json_file(file_path, update_function)

# ref: https://github.com/eth-clients/hoodi/blob/7f71638afc431675c19b9e306998b9d4925b7cec/metadata/chainspec.json#L68
def update_chainspec_json(config_dir):
    """Update chainspec.json with Cancun time hex"""
    def update_function(data):
        # Add blobSchedule config
        data['params']['blobSchedule'] = {
            "cancun": {
                "target": 3,
                "max": 6,
                "baseFeeUpdateFraction": 3338477
            },
            "prague": {
                "target": 6,
                "max": 9,
                "baseFeeUpdateFraction": 5007716
            }
        }
        data['params']['depositContractAddress'] = DEPOSIT_CONTRACT_ADDRESS
        # update pectra enabled EIP
        keys_to_update = [
            "eip2537TransitionTimestamp",
            "eip2935TransitionTimestamp",
            "eip6110TransitionTimestamp",
            "eip7002TransitionTimestamp",
            "eip7251TransitionTimestamp",
            "eip7702TransitionTimestamp",
            "eip7623TransitionTimestamp"
        ]
        
        for key in keys_to_update:
            data['params'][key] = hex(PECTRA_TIME)

        # TODO: temp 
        data['genesis']['timestamp'] = hex(GENESIS_TIME)
        
        return data
    
    file_path = os.path.join(config_dir, "chainspec.json")
    update_json_file(file_path, update_function)

def setup_argparse():
    """Set up argument parser for the script"""
    parser = argparse.ArgumentParser(
        description='Update configuration files for Prague network upgrade'
    )
    
    parser.add_argument(
        '--besu', 
        action='store_true',
        help='Update besu.json with Prague time and blob schedule'
    )
    
    parser.add_argument(
        '--genesis', 
        action='store_true',
        help='Update genesis.json with Prague time and blob schedule'
    )

    parser.add_argument(
        '--chainspec', 
        action='store_true',
        help='Update chainspec.json with Prague time hex'
    )
    
    parser.add_argument(
        '--all', 
        action='store_true',
        help='Update all configuration files'
    )
    
    parser.add_argument(
        '--config-dir',
        type=str,
        default=DEFAULT_CONFIG_DIR,
        help=f'Directory where config files are located (default: {DEFAULT_CONFIG_DIR})'
    )
    
    return parser

def main():
    """Main function to parse arguments and update selected files"""
    parser = setup_argparse()
    args = parser.parse_args()
    
    # Check if at least one action is specified
    if not (args.besu or args.genesis or args.chainspec or args.all):
        parser.print_help()
        return
    
    print(f"Starting Prague configuration update process using files from: {args.config_dir}")
    
    # Update selected files
    if args.all or args.besu:
        update_besu_json(args.config_dir)
    
    if args.all or args.genesis:
        update_genesis_json(args.config_dir)
    
    if args.all or args.chainspec:
        update_chainspec_json(args.config_dir)
    
    print("Prague configuration update completed!")

if __name__ == "__main__":
    main() 