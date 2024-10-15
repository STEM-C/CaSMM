import os
import requests

# URL to the Strapi media files API
studentid = 32
STRAPI_MEDIA_API = f"http://localhost:1337/api/students/{studentid}"
# Example for adding a JWT token to the request headers
headers = {
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    'Accept': 'application/json, text/plain, */*',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHMiOlszMl0sInNlc3Npb24iOjE4MjMsImNsYXNzcm9vbSI6OCwiaXNTdHVkZW50Ijp0cnVlLCJpYXQiOjE3Mjg0ODg1MTcsImV4cCI6MTczMTA4MDUxN30.6BqJ0x6Bcseljrtj0wwOUw55WPpexo0ZtFe8zD35bnw',
    

}

#response = requests.get(STRAPI_MEDIA_API, headers=headers)


# Directory where the videos will be saved
DOWNLOAD_DIR = "videos"

# Create download directory if it doesn't exist
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(f'./{DOWNLOAD_DIR}')

# Function to download a file from a URL
def download_video(url, filename):
    # Send a GET request to the URL
    response = requests.get(url, headers=headers, stream=True)
    print(response)

    # Check if the request was successful
    if response.status_code == 200:
        # Save the file locally
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
        
        # Extract URLs of videos (or any other media files)
        video_urls = [file['url'] for file in files if file['mime'].startswith('video')]
        print (video_urls)
        return video_urls
    else:
        print("Failed to fetch media files from Strapi")
        print(response)
        return []

# Main function to download videos
def download_videos():
    # Fetch video URLs from Strapi
    video_urls = fetch_video_urls()

    # Loop through each video URL and download it
    for i, url in enumerate(video_urls):
        # Generate a filename for the video
        filename = os.path.join(DOWNLOAD_DIR, f"{url[9:]}")
        
        # Prepend the base Strapi URL if necessary
        if url.startswith('/'):
            url = f"http://localhost:1337/api{url}"
        
        # Download the video
        download_video(url, filename)

# Run the script to download videos
if __name__ == "__main__":
    download_videos()
