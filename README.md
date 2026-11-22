# Rentora – Client

The frontend application of **Rentora**, a modern equipment rental platform built with Next.js, React, and TypeScript.

The client provides a responsive interface for customers, equipment owners, and administrators to interact with the Rentora platform.

## Features

- Responsive and modern user interface.
- User registration and login.
- Email and password authentication.
- Google and GitHub social authentication.
- Role-based dashboards for Customer, Owner, and Admin.
- Equipment browsing and details.
- Equipment management interfaces.
- User profile management.
- Cloudinary profile image upload.
- Rental management interfaces.
- Stripe payment integration.
- Protected routes and authentication state management.
- Toast notifications and form validation.

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Better Auth
- Stripe
- Cloudinary

## Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── ...
│   └── layout.tsx
│
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── layout/
│   └── ui/
│
├── hooks/
├── lib/
└── types/

public/
package.json
```

*The structure above is a general overview. Refer to the actual source directories for the complete structure.*

## Getting Started

### Prerequisites

- Node.js
- npm
- Running Rentora backend server

### Installation

Clone the repository and navigate to the client directory.

```bash
cd equipment-rental-platform-client
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the client root directory.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Add any additional variables required by your actual Better Auth and payment configuration.

Never expose secret keys through `NEXT_PUBLIC_` variables.

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Backend Connection

The client communicates with the Rentora Express backend through API requests.

Make sure the backend server is running and the API URL is correctly configured.

For local development:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

## Authentication

Rentora uses Better Auth for authentication.

Supported authentication methods:

- Email and password
- Google
- GitHub

The application supports role-based experiences for:

- Customer
- Equipment Owner
- Admin

## Image Upload

Cloudinary is used for profile and equipment image management.

The frontend sends image files to the backend, which handles validation and Cloudinary uploads.

## Payment Integration

Stripe is integrated for payment processing.

Use the appropriate test-mode configuration during development.

## Deployment

Before deploying:

- Configure production environment variables.
- Update the backend API URL.
- Configure Better Auth production URLs and trusted origins.
- Configure OAuth callback URLs.
- Verify Stripe configuration.
- Run `npm run build`.
- Deploy the frontend to your preferred hosting provider.

## Author

**Md Adnan Hossen**

Computer Science & Engineering Student

Northern University of Business and Technology, Khulna

- GitHub: [mdadnanhossen](https://github.com/mdadnanhossen)
- LinkedIn: [Adnan Hossen](https://linkedin.com/in/adnan35)

---

**Rentora – Making Equipment Rental Simple.**