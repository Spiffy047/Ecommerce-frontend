# SportZone E-commerce Platform

A comprehensive e-commerce platform with advanced user authentication, admin management, and security features.

## Features

### User Authentication & Security
- **Secure User Registration** with email validation
- **Two-Factor Security Questions** for account recovery
- **Password Reset System** using security questions
- **Separate Admin Authentication** with restricted access
- **JWT Token-based Authentication**
- **Profile Management** with personal information updates
- **Password Change** functionality

### User Experience
- **Personalized Login** with user name display
- **User Profile Dashboard** with order history
- **Review System** with user names tied to reviews
- **Shopping Cart** with authentication-required checkout
- **Order Confirmation** with order tracking

### Admin Features
- **Secure Admin Panel** with admin-only access
- **Product Management** (CRUD operations)
- **Best Sellers Analytics** showing top-selling products
- **Sales Revenue Tracking**
- **Admin Dashboard** with comprehensive controls

### Security Measures
- **Password Hashing** using bcrypt
- **Protected Routes** with authentication middleware
- **Admin Route Protection** preventing user access
- **Session Management** with JWT tokens
- **Input Validation** and sanitization

## System Requirements

### Backend
- Python 3.10+ (3.13.4 on Render)
- Flask 2.3.3
- PostgreSQL database
- pg8000 (PostgreSQL driver)
- Flask-JWT-Extended
- bcrypt
- Flask-CORS

### Frontend
- Node.js 16+
- React 18+
- React Router
- Tailwind CSS
- Formik & Yup (for forms)

## Installation & Setup

### Backend Setup
```bash
cd Ecommerce-Backend

# Install dependencies
pip install -r requirements.txt

# Set DATABASE_URL environment variable for PostgreSQL
export DATABASE_URL="postgresql://username:password@host:port/database"

# Start the backend server (database tables auto-created)
python app.py
```

### Frontend Setup
```bash
cd Ecommerce-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Default Accounts

### Admin Account
- **Email:** admin@sportzone.com
- **Password:** Admin@123
- **Access:** Full admin privileges

### Sample User Account
- **Email:** mike.wilson@example.com
- **Password:** Test123!
- **Access:** Regular user privileges

## Authentication Flow

### User Registration
1. User provides email, password, name, and optional contact info
2. User selects and answers two security questions
3. System creates account with hashed password and security answers
4. User receives JWT token for immediate login

### User Login
1. User enters email and password
2. System validates credentials
3. JWT token issued for authenticated sessions
4. User redirected to main store with personalized navigation

### Password Recovery
1. User enters email address
2. System displays security questions
3. User answers security questions
4. If correct, user can set new password
5. Password updated and user can login

### Admin Access
1. Separate admin login page with enhanced security
2. Admin credentials validated against admin flag
3. Admin-only routes protected from regular users
4. Admin panel with product and analytics management

## Database (PostgreSQL)

The application uses PostgreSQL database with automatic table creation and initialization. Database tables are created automatically on first startup with proper foreign key relationships and constraints.

### Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique user email
- `password_hash` - Bcrypt hashed password
- `name` - User's full name
- `phone` - Contact number (optional)
- `address` - User address (optional)
- `is_admin` - Admin flag (0/1)
- `security_question_1` - First security question
- `security_answer_1` - Hashed answer to first question
- `security_question_2` - Second security question
- `security_answer_2` - Hashed answer to second question
- `created_at` - Account creation timestamp

### Products Table
- `id` - Primary key
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `image_url` - Product image URL
- `stock` - Available quantity
- `total_sold` - Total units sold (for analytics)

### Orders Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `order_date` - Order timestamp
- `status` - Order status
- `total_amount` - Total order value

### Order Items Table
- `id` - Primary key
- `order_id` - Foreign key to orders
- `product_id` - Foreign key to products
- `quantity` - Ordered quantity
- `price_at_time` - Price when ordered

### Reviews Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `product_id` - Foreign key to products
- `rating` - Rating (1-5)
- `comment` - Review text
- `created_at` - Review timestamp

## Security Features

### Password Security
- Bcrypt hashing with salt
- Minimum password requirements
- Secure password reset process

### Authentication Security
- JWT tokens with expiration
- Protected API endpoints
- Role-based access control

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Admin Security
- Separate admin authentication
- Admin-only route protection
- Enhanced admin login process

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/forgot-password` - Get security questions
- `POST /api/auth/verify-security` - Verify security answers
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/orders` - Get user order history

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Add product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Reviews
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Add review (authenticated)

### Orders
- `POST /api/orders/checkout` - Process checkout (authenticated)

### Analytics
- `GET /api/admin/bestsellers` - Get best-selling products (admin only)

## Frontend Components

### Authentication Components
- `UserAuth.jsx` - Login/Register with security questions
- `AdminAuth.jsx` - Secure admin login
- `UserProfile.jsx` - Profile management and order history

### Shopping Components
- `ProductList.jsx` - Product catalog
- `ProductDetails.jsx` - Product details with reviews
- `CartPage.jsx` - Shopping cart with checkout
- `ReviewForm.jsx` - Authenticated review submission

### Admin Components
- `AdminPage.jsx` - Admin dashboard with tabs
- `AdminProductForm.jsx` - Product management form

### Navigation
- `Navbar.jsx` - Responsive navigation with user state
- `App.jsx` - Route protection and authentication context

## User Journey

### New User Registration
1. Visit registration page
2. Fill personal information
3. Select and answer security questions
4. Account created and logged in
5. Redirected to store with personalized experience

### Shopping Experience
1. Browse products as guest or authenticated user
2. Add items to cart
3. Authentication required for checkout
4. Order confirmation with tracking
5. Order history available in profile

### Review System
1. Authentication required to write reviews
2. User name displayed with reviews
3. Reviews tied to user accounts
4. Review history in user profile

### Admin Management
1. Secure admin login
2. Product management (add/edit/delete)
3. View best sellers and analytics
4. Monitor sales performance

## Deployment

### Backend Deployment (Render)
- **Live URL:** https://ecommerce-backend-rfab.onrender.com
- **Database:** PostgreSQL on Render
- **Runtime:** Python 3.13.4 (auto-selected by Render)
- **Driver:** pg8000 (pure Python PostgreSQL driver)
- **Auto-deployment:** Connected to GitHub repository
- **Database initialization:** Automatic table creation with IF NOT EXISTS

### Frontend Deployment (Render)
- **Live URL:** https://sportzone-t1e0.onrender.com
- Build production bundle: `npm run build`
- Deploy to Netlify with automatic builds
- Environment variables configured for production API


## Contributing

1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request

## Contributors
1. @spiffy047 - Lead Developer
2. @abubakar324 - Developer


## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation
- reach out to mwanikijoe1@gmail.com
---

**SportZone E-commerce Platform** - Secure, scalable, and user-friendly online shopping experience with comprehensive authentication and admin management.
