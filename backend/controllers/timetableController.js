const Timetable = require('../models/Timetable');

// Create a new timetable
exports.createTimetable = async (req, res) => {
  try {
    // Destructure academicYear and session from req.body
    const { branch, section, semester, batch, facultyName, subjectName, courseCode, type, time, room, academicYear, session } = req.body;

    // Create a new Timetable instance including academicYear and session
    const newTimetable = new Timetable({
      branch,
      section,
      semester,
      batch,  // Include batch in the creation
      facultyName,
      subjectName,
      courseCode,
      type,
      time,
      room,
      academicYear, // Include academicYear in the creation
      session,      // Include session in the creation
      createdBy: req.user._id // Assuming req.user is set by authentication middleware
    });

    // Save the new timetable to the database
    await newTimetable.save();

    // Send a success response with the created timetable
    res.status(201).json(newTimetable);
  } catch (error) {
    console.error('Error creating timetable:', error);
    res.status(500).json({ message: 'Failed to create timetable' });
  }
};


// Get all timetables based on filters
exports.getTimetables = async (req, res) => {
  try {
    const { branch, section, semester, batch } = req.query; // Include batch in the query
    const query = {};

    if (branch) query.branch = branch;
    if (section) query.section = section;
    if (semester) query.semester = semester;
    if (batch) query.batch = batch; // Add batch filter

    const timetables = await Timetable.find(query);
    res.status(200).json(timetables);
  } catch (error) {
    console.error('Error fetching timetables:', error);
    res.status(500).json({ message: 'Failed to fetch timetables' });
  }
};

// Get Timetables by specific criteria (semester, branch, section, batch)
exports.getTimetablesByCriteria = async (req, res) => {
  const { semester, branch, section, batch } = req.query; // Include batch in the query

  try {
    const query = {};
    if (semester) query.semester = semester;
    if (branch) query.branch = branch;
    if (section) query.section = section;
    if (batch) query.batch = batch; // Add batch filter

    const timetables = await Timetable.find(query);
    res.status(200).json(timetables);
  } catch (error) {
    console.error('Error fetching timetables by criteria:', error);
    res.status(500).json({ message: 'Failed to fetch timetables by criteria' });
  }
};

// Get a specific timetable by ID
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error fetching timetable by ID:', error);
    res.status(500).json({ message: 'Failed to fetch timetable' });
  }
};

// Update a specific timetable by ID
exports.updateTimetable = async (req, res) => {
  try {
    const { branch, section, semester, batch, facultyName, subjectName, courseCode, type, time, room } = req.body;

    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      { branch, section, semester, batch, facultyName, subjectName, courseCode, type, time, room },
      { new: true, runValidators: true }
    );

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error updating timetable:', error);
    res.status(500).json({ message: 'Failed to update timetable' });
  }
};

// Delete a specific timetable by ID
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable:', error);
    res.status(500).json({ message: 'Failed to delete timetable' });
  }
};
