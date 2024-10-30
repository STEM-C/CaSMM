import requests
import os

# Strapi URL, output directory, and headers
strapi_url = 'http://casmm.org/api'  # Replace with your Strapi URL
output_dir = './new_videos'  # Change to your desired directory
headers = {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            'Accept': 'application/json, text/plain, */*',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEzLCJpYXQiOjE3Mjk2OTU2OTIsImV4cCI6MTczMjI4NzY5Mn0.MXQeZXwivvyfnq6F-TZVNmblO9FfsDMJ0-gXVghJDqA',
            

        }

# Ensure output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Fetch files from Strapi
response = requests.get(f'{strapi_url}/upload/files', headers=headers)
if response.status_code == 200:
    files = response.json()
    i = 0
    print(len(files))
    for file in files:
        if i ==0:
            i = 1
            continue
        # Check if the file is a video
        if file['mime'] and 'video' in file['mime']:
            file_url = f"{strapi_url}{file['url']}"
            file_path = os.path.join(output_dir, file['name'])
            
            # Download each video file
            try:
                with requests.get(file_url, headers=headers, stream=True) as r:
                    r.raise_for_status()
                    with open(file_path, 'wb') as f:
                        for chunk in r.iter_content(chunk_size=8192):
                            f.write(chunk)
                print(f"Downloaded: {file['name']}")
            except Exception as error:
                print(error)
                continue
else:
    print(f"Failed to fetch files: {response.status_code}, {response.text}")
