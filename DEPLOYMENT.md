# FitFusion Deployment Guide

This document provides instructions for deploying the FitFusion website to various hosting platforms.

## Option 1: Using the Deployment Script

1. Install dependencies:
   ```
   npm install
   ```

2. Run the deployment script:
   ```
   npm run deploy
   ```

3. Upload the generated `fitfusion-deploy.zip` file to your web hosting service.

## Option 2: Deploy to Netlify

### Method 1: Drag and Drop (Easiest)

1. Go to [Netlify](https://app.netlify.com/) and sign up or log in.

2. From your Netlify dashboard, drag and drop the entire project folder onto the designated area.

3. Wait for the upload to complete, and your site will be deployed automatically.

4. You can configure your custom domain and other settings in the Netlify dashboard.

### Method 2: Using Netlify CLI

1. Install Netlify CLI (if not already installed):
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

### Method 3: Using the netlify.toml Configuration

A `netlify.toml` file has been created in your project. This file contains the configuration for your Netlify deployment. You can use any of the methods above, and the configuration will be automatically applied.

## Option 3: Deploy to Vercel

1. Install Vercel CLI (if not already installed):
   ```
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```
   vercel
   ```

3. Follow the prompts to authenticate and deploy your site.

## Option 4: Deploy to GitHub Pages

1. Create a GitHub repository and push your code to it.

2. Enable GitHub Pages in the repository settings.

3. The GitHub Actions workflow in `.github/workflows/deploy.yml` will automatically deploy your site to GitHub Pages when you push to the main branch.

## Testing Your Deployment Locally

To test your site locally before deploying:

```
npm start
```

This will start a local server and open your site in a browser.