# ShopEra 🛍️

ShopEra is a modern, premium e-commerce web application built with the latest web technologies. It features a stunning user interface, seamless shopping experience, and robust backend integrations.

## 🔗 Demo
https://shop-era-7c4u-5i0hfb4uk-yachna-jpgs-projects.vercel.app/

## ✨ Features

- **Premium UI/UX:** A beautifully crafted, responsive design featuring high-quality aesthetics, smooth transitions, and intuitive layouts.
- **Full E-Commerce Flow:** Browse products, view detailed product pages (with color/size selection), and manage your shopping bag.
- **Secure Authentication:** User login and registration powered by NextAuth, including session management and protected routes.
- **Stripe Checkout:** Seamless and secure payment processing using Stripe.
- **Wishlist & Cart Management:** Real-time state management for saving favorite items and managing cart quantities.
- **Admin Dashboard:** Manage products and track orders directly from an integrated admin panel.
- **SEO Optimized:** Built with best practices to ensure high search engine visibility.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Payments:** [Stripe](https://stripe.com/)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- A PostgreSQL database
- A Stripe account (for payment processing)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd shopera
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the necessary environment variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/shopera"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
   STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
   ```

4. **Initialize the Database:**
   Generate the Prisma client and push the schema to your database.
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(Optional)* Run the seed script if you have one to populate initial data:
   ```bash
   npm run prisma:seed
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📂 Project Structure

- `src/app/` - Next.js App Router pages and API routes.
- `src/components/` - Reusable React components (UI elements, Layout, Skeletons).
- `src/context/` - Global state management (CartContext, AuthContext).
- `src/lib/` - Utility functions, API helpers, and validation schemas.
- `prisma/` - Database schema and configuration.

## 📄 License

This project is licensed under the MIT License.
