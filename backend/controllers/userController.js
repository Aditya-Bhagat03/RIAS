// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Timetable = require('../models/Timetable');

// Register User
exports.register = async (req, res) => {
  const {
    username, email, password, role,
    mobileNumber, registrationNumber, semester, branch, section, rollNumber
  } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    user = new User({
      username, email, password, role,
      mobileNumber, registrationNumber, semester, branch, section, rollNumber
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user._id, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getnotadmin = async (req, res) => {
  try {
    // Assuming req.user contains the logged-in user's details
    const loggedInUser = req.user;

    // Check if the logged-in user is a class teacher
    if (loggedInUser.role === 'faculty' && loggedInUser.isApproved) {
      // Fetch students with the same branch, section, and semester as the class teacher
      const students = await User.find({
        role: 'student',
        branch: loggedInUser.branch,
        section: loggedInUser.section,
        semester: loggedInUser.semester,
        isApproved: true // Optional: Only fetch approved students
      }).select('-password');

      res.status(200).json(students);
    } else {
      // Return error if the user is not a class teacher or is not approved
      res.status(403).json({ error: 'Unauthorized access' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update User Info
exports.updateUserInfo = async (req, res) => {
  const { username, email, mobileNumber, registrationNumber, semester, branch, section, rollNumber } = req.body;

  try {
    const userId = req.user.id;

    // Prepare update data
    const updateData = {
      username,
      email,
      mobileNumber,
      registrationNumber,
      semester,
      branch,
      section,
      rollNumber
    };

    // Update the user information
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get User Info (logged-in user)
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select('-password');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Branches
exports.getBranches = async (req, res) => {
  try {
    // Fetch all unique branches from the User collection
    const branches = await User.distinct('branch');
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Sections
exports.getSections = async (req, res) => {
  try {
    const sections = await User.distinct('section');
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Semesters
exports.getSemesters = async (req, res) => {
  try {
    const semesters = await User.distinct('semester');
    res.status(200).json(semesters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Students by Semester, Branch, and Section
exports.getStudentsByCriteria = async (req, res) => {
  const { semester, branch, section } = req.query;

  try {
    const query = {};
    if (semester) query.semester = semester;
    if (branch) query.branch = branch;
    if (section) query.section = section;

    const students = await User.find(query).select('-password');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get All Sessions
exports.getSessions = async (req, res) => {
  try {
    // Fetch distinct session values
    const sessions = await User.distinct('session');
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Get All Academic Years
exports.getAcademicYears = async (req, res) => {
  try {
    // Fetch distinct academic year values
    const academicYears = await User.distinct('academicYear');
    res.status(200).json(academicYears);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Get All Distinct Subject Names
exports.getDistinctSubjectNames = async (req, res) => {
  try {
    // Fetch distinct subjectName values
    const subjectNames = await Timetable.distinct('subjectName');
    res.status(200).json(subjectNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get All Distinct courseode
exports.getDistinctcoursecode = async (req, res) => {
  try {
    // Fetch distinct subjectName values
    const courseCode = await Timetable.distinct('courseCode');
    res.status(200).json(courseCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






