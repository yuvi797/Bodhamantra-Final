# Bodhamantraa - Mentor-Student Connection Platform

A comprehensive web application that connects students with senior mentors. Students can browse approved mentors, send connection requests, and receive guidance. Mentors can manage their profiles, respond to requests, and track their mentoring activities. Admins can manage users, approve mentors, and monitor all platform activities.

## 🎯 Features

### Student Portal
- **Registration & Authentication**: Students can register with their details and login securely
- **Browse Mentors**: View all approved mentors with their profiles, ratings, and availability
- **Send Requests**: Create connection requests with title and description
- **Track Requests**: Monitor status of all sent requests (pending/accepted/declined)
- **View Mentor Profiles**: See mentor's service areas, availability, ratings, and number of students mentored

### Mentor Portal
- **Registration with Verification**: Mentors register with detailed profile and ID card upload
- **Profile Management**: Update availability hours, services, and profile information
- **Request Management**: View and respond to incoming student requests
- **Dashboard Analytics**: Track number of students mentored, ratings, and request statistics
- **Review System**: Receive reviews and ratings from students after mentoring sessions

### Admin Panel
- **User Management**: View all registered users (students and mentors)
- **Mentor Approval**: Review pending mentor registrations and approve/reject based on credentials
- **Request Monitoring**: View all student-mentor connection requests and their statuses
- **Platform Statistics**: Track total users, approved mentors, pending approvals, and total requests
- **ID Verification**: Review uploaded ID cards before approving mentors

## 🏗️ Project Structure

```
Bodhamantraa/
├── client/                 # Student & Mentor Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── StudentRegister.jsx
│   │   │   ├── MentorRegister.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── MentorDashboard.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── admin/                  # Admin Panel Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                 # Backend API
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middlewares/
    ├── utils/
    ├── app.js
    └── server.js
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bodhamantraa
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EOF

# Start the server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 2. Student/Mentor Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The student/mentor portal will run on `http://localhost:5173`

### 3. Admin Panel Setup

```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Start development server
npm run dev
```

The admin panel will run on `http://localhost:5174`

## 🔑 Default Admin Credentials

You'll need to create an admin user in the database manually or through a seed script:

```javascript
// Example admin document in MongoDB
{
  "name": "Admin",
  "email": "admin@bodhamantraa.com",
  "password": "<hashed_password>",
  "role": "admin"
}
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Student Routes
- `GET /api/students/mentors` - Get all approved mentors
- `POST /api/students/requests` - Create a new request
- `GET /api/students/requests` - Get student's requests

### Mentor Routes
- `POST /api/mentors/register` - Register as mentor
- `GET /api/mentors/requests` - Get mentor's incoming requests
- `PUT /api/mentors/requests/:id` - Update request status
- `PUT /api/mentors/profile` - Update mentor profile

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `GET /api/admin/mentors` - Get all mentors (with filter)
- `PUT /api/admin/mentors/:id/approve` - Approve mentor
- `PUT /api/admin/mentors/:id/reject` - Reject mentor
- `GET /api/admin/requests` - Get all requests
- `GET /api/admin/stats` - Get platform statistics

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload

## 🔐 Authentication Flow

1. **Student/Mentor**: 
   - Register → Login → Access Dashboard → JWT stored in localStorage
   - Protected routes check for valid token

2. **Admin**:
   - Login with admin credentials → Access Admin Panel → JWT stored separately
   - Separate authentication context for admin

## 📱 User Workflows

### Student Workflow
1. Register with personal information
2. Login to access dashboard
3. Browse approved mentors
4. Send connection request with title and description
5. Track request status
6. After completion, leave review and rating

### Mentor Workflow
1. Register with profile details and ID card
2. Wait for admin approval
3. Once approved, login to dashboard
4. Set availability hours and status
5. Receive and manage student requests
6. Accept or decline requests
7. Track mentoring statistics

### Admin Workflow
1. Login to admin panel
2. View platform statistics
3. Review pending mentor applications
4. Verify ID cards and approve/reject mentors
5. Monitor all user activities
6. View all connection requests

## 🛠️ Development

### Running All Services

You can run all services simultaneously using separate terminal windows:

**Terminal 1 - Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 - Student/Mentor Portal:**
```bash
cd client && npm run dev
```

**Terminal 3 - Admin Panel:**
```bash
cd admin && npm run dev
```

### Building for Production

**Client:**
```bash
cd client
npm run build
```

**Admin:**
```bash
cd admin
npm run build
```

## 🔄 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bodhamantraa
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (Optional)
```
VITE_API_URL=http://localhost:5000/api
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Your Name - Initial work

## 🤝 Support

For support, email support@bodhamantraa.com or create an issue in the repository.

## 🚧 Future Enhancements

- [ ] Real-time chat between students and mentors
- [ ] Video call integration
- [ ] Advanced search and filters for mentors
- [ ] Email notifications
- [ ] Mobile application
- [ ] Payment integration for premium mentoring
- [ ] Analytics dashboard for mentors
- [ ] Automated mentor matching based on student needs
"# Bodhamantra" 
