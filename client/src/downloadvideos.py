import os
from pathlib import Path
import requests

# URL to the Strapi media files API
for i in range(845, 911):
    try:
        STRAPI_MEDIA_API = f"http://casmm.org/api/students/{i}"
        # Example for adding a JWT token to the request headers
        headers = {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            'Accept': 'application/json, text/plain, */*',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEzLCJpYXQiOjE3Mjk2OTU2OTIsImV4cCI6MTczMjI4NzY5Mn0.MXQeZXwivvyfnq6F-TZVNmblO9FfsDMJ0-gXVghJDqA',
            

        }

        #response = requests.get(STRAPI_MEDIA_API, headers=headers)


        # Directory where the videos will be saved
        DOWNLOAD_DIR = f"./videos/{i}"

        # Create download directory if it doesn't exist
        if not os.path.exists(f"{DOWNLOAD_DIR}"):
            os.makedirs(f'{DOWNLOAD_DIR}')

        # Function to download a file from a URL
        def download_video(url, filename, newfilename):
            # Send a GET request to the URL
            response = requests.get(url, headers=headers, stream=True)
            print(url)
            print(response)

            # Check if the request was successful
            if response.status_code == 200:
                print(filename)                # Save the file locally
                with open(filename, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                print(f"Downloaded: {filename}")
            else:
                print(f"Failed to download {url}")

        # Function to fetch video URLs from Strapi
        def fetch_video_urls():
            # Send a GET request to the Strapi API to get the media files
            response = requests.get(STRAPI_MEDIA_API, headers=headers)

            # Check if the request was successful
            if response.status_code == 200:
                # Parse the JSON response
                files = response.json()['recordings']
                print(files)
                
                # Extract URLs of videos (or any other media files)
                video_urls = [file['id'] for file in files if file['mime'].startswith('video')]
                video_names = [file['name'] for file in files if file['mime'].startswith('video')]
                filename_real = [file['url'] for file in files if file['mime'].startswith('video')]
                print (video_urls)
                return video_urls, video_names, filename_real
            else:
                print("Failed to fetch media files from Strapi")
                print(response)
                return []

        # Main function to download videos
        def download_videos():
            # Fetch video URLs from Strapi
            video_urls, video_names, filenamez = fetch_video_urls()

            # Loop through each video URL and download it
            for i, url in enumerate(video_urls):
                # Generate a filename for the video
                filename = video_names[i]
                filename_real = filenamez[i]
                
                # Prepend the base Strapi URL if necessary

                url = f"http://casmm.org/api{filename_real}"
                
                # Download the video
                download_video(url, os.path.join(DOWNLOAD_DIR,filename_real[9:]), filename)
        # Run the script to download videos
        if __name__ == "__main__":
            download_videos()
    except Exception as error:
        print(f'fail at {i}')
        print(error)
        continue