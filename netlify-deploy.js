// Netlify deployment script for FitFusion website
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify deployment process for FitFusion...');

// Check if netlify CLI is installed
try {
  console.log('✅ Checking if Netlify CLI is installed...');
  execSync('netlify --version', { stdio: 'ignore' });
  console.log('✅ Netlify CLI is installed.');
} catch (error) {
  console.log('❌ Netlify CLI is not installed. Installing now...');
  try {
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    console.log('✅ Netlify CLI installed successfully.');
  } catch (installError) {
    console.error('❌ Failed to install Netlify CLI:', installError.message);
    process.exit(1);
  }
}

// Check if netlify.toml exists, create if not
const netlifyTomlPath = path.join(__dirname, 'netlify.toml');
if (!fs.existsSync(netlifyTomlPath)) {
  console.log('⚠️ netlify.toml not found. Creating default configuration...');
  const netlifyTomlContent = `# Netlify configuration file

[build]
  publish = "./"
  command = "# no build command needed for static site"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  framework = "#static"
`;
  
  try {
    fs.writeFileSync(netlifyTomlPath, netlifyTomlContent);
    console.log('✅ netlify.toml created successfully.');
  } catch (writeError) {
    console.error('❌ Failed to create netlify.toml:', writeError.message);
  }
}

// Deploy to Netlify
console.log('🔄 Deploying to Netlify...');
console.log('\n📋 You will be prompted to:');
console.log('1. Log in to your Netlify account (if not already logged in)');
console.log('2. Select a team');
console.log('3. Create a new site or select an existing one');
console.log('\n🚀 Starting deployment process now...');

try {
  execSync('netlify deploy --prod', { stdio: 'inherit' });
  console.log('\n✅ Deployment completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Configure your custom domain in the Netlify dashboard');
  console.log('2. Set up HTTPS for your site');
  console.log('3. Configure form handling or other Netlify features as needed');
} catch (deployError) {
  console.error('\n❌ Deployment failed:', deployError.message);
  console.log('\n🔄 You can try manual deployment:');
  console.log('1. Go to https://app.netlify.com/');
  console.log('2. Drag and drop your project folder to deploy');
}