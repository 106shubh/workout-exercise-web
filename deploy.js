// Simple deployment script for FitFusion website
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join(__dirname, 'fitfusion-deploy.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log('✅ Deployment package created successfully!');
  console.log(`📦 Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n📋 Deployment Instructions:');
  console.log('1. Upload the "fitfusion-deploy.zip" file to your web hosting service');
  console.log('2. Extract the zip file on your server');
  console.log('3. Point your domain to the extracted folder');
  console.log('\n🌐 For specific hosting providers:');
  console.log('- Netlify: Drag and drop the entire folder to Netlify');
  console.log('- Vercel: Run "vercel" command in this directory');
  console.log('- GitHub Pages: Push this code to a GitHub repository and enable GitHub Pages');
});

// Handle warnings and errors
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('⚠️ Warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files to the archive
archive.directory(path.join(__dirname, '/'), false);

// Finalize the archive
archive.finalize();

console.log('🔄 Creating deployment package...');