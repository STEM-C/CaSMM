const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Strapi URL and headers
const strapiUrl = 'http://casmm.org/api'; // Replace with your Strapi URL
const outputDir = './downloads'; // Change to your desired directory
const headers = {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHMiOls4NDRdLCJzZXNzaW9uIjo1NjA2LCJjbGFzc3Jvb20iOjMyLCJpc1N0dWRlbnQiOnRydWUsImlhdCI6MTcyOTc5NTE2MywiZXhwIjoxNzMyMzg3MTYzfQ.pJ8Twrld8IwUCP78JhV4o8BmPo2_qUQWPzL4FQGgkM4',
            
};

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

async function fetchFiles(page = 2) {
    //const response = await axios.get(`${strapiUrl}/upload/files?page=${page}?pagesize=100`, { headers});
    var responseset = []
    for (var i = 700; i<800; i++){
        try {
            console.log(i)
            response = await axios.get(`${strapiUrl}/upload/files/${i}`, { headers});
            responseset.push(response.data);
        }
        catch {
            continue
        }
    }
    return responseset;
}

async function downloadFile(file) {
    console.log('howdy')
    const fileUrl = `${strapiUrl}${file.url}`;
    console.log(fileUrl)
    const response = await axios.get(fileUrl, { headers, responseType: 'stream' });
    
    const filePath = path.join(outputDir, file.name);
    const writer = fs.createWriteStream(filePath);
    
    response.data.pipe(writer);
    //console.log(response.data)
    
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function downloadVideos() {
    let page = 3;
    let files;

    do {
        files = await fetchFiles(2);
        for (var i=0; i<files.length;i++){
            files[i].name = files[i].name.replace(/[/:]/g, '');
        }
        const videoFiles = files.filter(file => file.mime && file.mime.includes('video'));

        await Promise.all(videoFiles.map(downloadFile));
        page++;

    } while (page < 5);
}

downloadVideos().catch(console.error);
