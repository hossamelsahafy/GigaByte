# GigaByte E-commerce Platform

## Overview

GigaByte is a fully functional e-commerce platform built using **Next.js** and **Payload CMS**. It includes user authentication, product management, cart and checkout features, and email notifications.

## Features

- **Admin Dashboard**: Manage products and categories.
- **Authentication**: Google & Facebook OAuth login.
- **Password Management**: Forget password, change password.
- **Cart & Checkout**: Users can add items to the cart and confirm orders.
- **Email Notifications**: Order confirmation emails are sent to both users and the site owner.
- **CMS Integration**: Products and categories can be managed through Payload CMS.
- **Contact Us & About Us Pages**.

## Media Upload

Images must be uploaded from your local system or deployed on a server like Digital Ocean that provides storage and hosting for media files. Configure Payload CMS to store images locally or use a dedicated media storage solution on your server.

## Requirements

### Environment Variables

Ensure the following environment variables are set up in your `.env.local` file:

```env
# Authentication Secrets
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
PAYLOAD_SECRET=your_payload_secret

# Database
MONGODB_URI=your_mongodb_connection_string
DATABASE_URI=same_as_mongodb_uri

# OAuth Credentials
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email SMTP Configuration
SMTP_SERVER_HOST=your_smtp_host
SITE_MAIL_RECIEVER=your_email
SMTP_SERVER_USERNAME=your_smtp_username
SMTP_SERVER_PASSWORD=your_smtp_password
TO=your-email

# Host Configurations
NEXT_PUBLIC_HOST=your_host_or_domain
HOST=your_host_or_domain
NEXTAUTH_URL=your_nextauth_url

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

## Installation & Setup

1. **Clone the Repository**:

   ```bash
   git https://github.com/hossamelsahafy/GigaByte.git
   cd GigaByte
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   - Copy `.env.example` to `.env.local` and update values accordingly.

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

5. **Access the Application**:
   - Frontend: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin`

## Deployment

For deployment, ensure you update the **NEXT_PUBLIC_HOST** and **NEXTAUTH_URL** to the correct production domain.
