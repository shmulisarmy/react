import os

def file_size_in_kb(file_path):
    # Check if the file exists
    if not os.path.isfile(file_path):
        print(f"The file {file_path} does not exist.")
        return None
    
    # Get the file size in bytes
    file_size_bytes = os.path.getsize(file_path)
    
    # Convert the file size to kilobytes
    file_size_kb = file_size_bytes / 1024
    
    return file_size_kb

# Example usage
file_path = 'min.js'
size_kb = file_size_in_kb(file_path)

if size_kb is not None:
    print(f"The size of the file '{file_path}' is {size_kb:.2f} KB")
