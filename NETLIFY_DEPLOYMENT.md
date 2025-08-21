# Netlify Deployment Guide for FitFusion

This guide provides step-by-step instructions for deploying your FitFusion website to Netlify.

## Option 1: One-Click Deployment (Easiest)

1. Run the automated Netlify deployment script:

   ```
   npm run deploy:netlify
   ```

   This script will:
   - Check if Netlify CLI is installed (and install it if needed)
   - Verify the netlify.toml configuration file exists
   - Start the deployment process
   - Guide you through the necessary steps

2. Follow the prompts in the terminal to complete the deployment.

## Option 2: Manual Drag-and-Drop Deployment

1. Go to [Netlify](https://app.netlify.com/) and sign up or log in.

2. From your Netlify dashboard, click on the "Sites" section.

3. Drag and drop your entire project folder onto the designated area that says "Drag and drop your site folder here".

4. Wait for the upload to complete. Netlify will automatically detect your site configuration.

5. Once deployed, you'll receive a unique URL where your site is live (e.g., https://fitfusion-123abc.netlify.app).

6. You can configure your custom domain and other settings in the Netlify dashboard.

## Option 3: Using Netlify CLI Manually

1. Install Netlify CLI globally (if not already installed):

   ```
   npm install -g netlify-cli
   ```

2. Log in to your Netlify account:

   ```
   netlify login
   ```

3. Initialize your site (if not already done):

   ```
   netlify init
   ```

4. Deploy to Netlify:

   ```
   netlify deploy --prod
   ```

5. Your site will be deployed and a live URL will be provided.

## Netlify Configuration

A `netlify.toml` file has been created in your project with the following configuration:

```toml
# Netlify configuration file

[build]
  publish = "./"
  command = "# no build command needed for static site"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  framework = "#static"
```

This configuration:
- Sets the publish directory to the root folder
- Configures proper redirects for single-page applications
- Specifies that this is a static site with no build command

## Additional Netlify Features

After deployment, you can configure additional Netlify features through the dashboard:

1. **Custom Domains**: Connect your own domain name
2. **HTTPS**: Automatically enabled for all sites
3. **Form Handling**: Add form functionality without server-side code
4. **Identity**: Add authentication to your site
5. **Functions**: Add serverless functions

## Troubleshooting

If you encounter issues during deployment:

1. Check that all files are properly included in your project folder
2. Verify that your netlify.toml file is correctly configured
3. Try the drag-and-drop method if CLI deployment fails
4. Check Netlify's deployment logs for specific error messages