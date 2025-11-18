import jwt from 'jsonwebtoken';
import Student from '../models/student.model.js';
import Mentor from '../models/mentor.model.js';
import Admin from '../models/admin.model.js';

const auth = (rolesAllowed = []) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    console.log("this is working");
    
    if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    // payload can have: { id, type } or { id, role } for admin

    let user;
    let userType;

    // Check if it's admin (has role property)
    if (payload.role === 'admin') {
      user = await Admin.findById(payload.id);
      userType = 'admin';
    } else if (payload.type === 'student') {
      user = await Student.findById(payload.id);
      userType = 'student';
    } else if (payload.type === 'mentor') {
      user = await Mentor.findById(payload.id);
      userType = 'mentor';
    }

    if (!user) return res.status(401).json({ message: 'User not found' });

    // Check role authorization
    if (rolesAllowed.length && !rolesAllowed.includes(userType)) {
      return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
    }

    req.user = user;
    req.userType = userType;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default auth;
