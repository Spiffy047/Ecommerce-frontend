# SportZone - Ecommerce Application

A full-stack ecommerce application for sporting goods built with Flask backend and React frontend.

## Features

- **Product Management**: Full CRUD operations for sports products
- **Admin Authentication**: Secure admin panel with JWT authentication
- **Review System**: Customer reviews with ratings
- **Shopping Cart**: Add to cart functionality
- **Search**: Product search by name and description
- **Responsive Design**: Modern, mobile-friendly interface

## Tech Stack

**Backend:**
- Flask (Python)
- SQLAlchemy ORM
- JWT Authentication
- SQLite Database
- CORS enabled

**Frontend:**
- React 18
- React Router
- Formik + Yup validation
- Tailwind CSS
- Context API for state management

## Setup Instructions

### Backend Setup
```bash
cd Ecommerce-Backend
pip install -r requirements.txt
python fix_and_run.py  # Initialize database with sample data
python app.py          # Start Flask server on port 5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev           # Start development server
```

## Admin Access

**Default Admin Credentials:**
- Email: `admin@sportzone.com`
- Password: `admin123`

⚠️ **Security Note**: Change the default admin password immediately after first login.

## Database Models

- **User**: Customer and admin accounts
- **Product**: Sports merchandise items
- **Review**: Product reviews and ratings
- **Order**: Customer orders with many-to-many product relationships

## API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/<id>` - Update product (admin only)
- `DELETE /api/products/<id>` - Delete product (admin only)

### Reviews
- `GET /api/products/<id>/reviews` - Get product reviews
- `POST /api/products/<id>/reviews` - Add review

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/change-password` - Change password (authenticated)

## Security Features

- JWT token authentication
- Admin role-based access control
- Password hashing with bcrypt
- Input validation and sanitization
- Protected admin endpoints

## Development Notes

- Database file (`ecommerce.db`) is gitignored for security
- Admin creation scripts are excluded from version control
- Environment variables should be used for production secrets
- Default credentials are for development only

## License

This project is for educational purposes.