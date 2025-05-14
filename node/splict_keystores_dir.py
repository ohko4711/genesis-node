import os
import glob
import math
import shutil
import argparse

def copy_files_to_subdirs(source_dir, num_subdirs):
    """
    Copies files matching 'keystore-*.json' from a source directory
    into a specified number of newly created subdirectories, leaving originals intact.

    Args:
        source_dir (str): The path to the directory containing the files.
        num_subdirs (int): The desired number of subdirectories to create.
    """
    if num_subdirs <= 0:
        print("Error: Number of subdirectories must be a positive integer.")
        return

    if not os.path.isdir(source_dir):
        print(f"Error: Source directory not found at {source_dir}")
        return
devnet
    # Find all keystore files in the source directory
    file_pattern = os.path.join(source_dir, 'keystore-*.json')
    # Use os.path.basename to get just the filenames for copying logic
    files_to_copy = sorted(glob.glob(file_pattern)) # Sort for deterministic order

    total_files = len(files_to_copy)

    if total_files == 0:
        print(f"No files matching 'keystore-*.json' found in {source_dir}. No action taken.")
        return

    if num_subdirs > total_files:
        print(f"Warning: Number of subdirectories ({num_subdirs}) is greater than the number of files ({total_files}). Adjusting to {total_files} subdirectories.")
        num_subdirs = total_files

    files_per_subdir = math.ceil(total_files / num_subdirs)

    print(f"Found {total_files} files. Copying them into {num_subdirs} subdirectories inside '{source_dir}'...")

    file_iterator = iter(files_to_copy)

    for i in range(num_subdirs):
        subdir_name = f"group_{i+1}"
        subdir_path = os.path.join(source_dir, subdir_name)

        try:
            os.makedirs(subdir_path, exist_ok=True) # Create subdir, ignore if exists
            # No need to print creation every time if exist_ok=True
            # print(f"Ensured subdirectory exists: '{subdir_path}'")
        except OSError as e:
            print(f"Error creating subdirectory {subdir_path}: {e}")
            return # Stop if we can't create a directory

        files_copied_to_current_subdir = 0
        for _ in range(files_per_subdir):
            file_to_copy = next(file_iterator, None)
            if file_to_copy is None:
                break # No more files left

            destination_path = os.path.join(subdir_path, os.path.basename(file_to_copy))

            try:
                # Use shutil.copy2 to copy file and metadata
                shutil.copy2(file_to_copy, destination_path)
                files_copied_to_current_subdir += 1
            except Exception as e:
                print(f"Error copying file {os.path.basename(file_to_copy)} to {destination_path}: {e}")

        if files_copied_to_current_subdir > 0:
             print(f"Copied {files_copied_to_current_subdir} files to '{subdir_path}'") # Changed print message

    print("File copying complete.") # Changed print message

# python splict_keystores_dir.py    pectra_devnet1_validator_keys/validator_keys 3
if __name__ == "__main__":
    # Updated description
    parser = argparse.ArgumentParser(description="Copy keystore-*.json files from a directory into subdirectories.")
    parser.add_argument("source_dir", help="Path to the source directory containing keystore-*.json files.")
    parser.add_argument("num_subdirs", type=int, help="Number of subdirectories to create and distribute copies into.")

    args = parser.parse_args()

    copy_files_to_subdirs(args.source_dir, args.num_subdirs) # Call renamed function 