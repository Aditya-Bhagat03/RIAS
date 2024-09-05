const User = require("../models/User");
const csv = require("csv-parser");
const Timetable = require("../models/Timetable");

const fs = require("fs");
const bcrypt = require("bcryptjs");

exports.uploadCSV = async (req, res) => {
  try {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const row of results) {
          const {
            username,
            email,
            password,
            role,
            mobileNumber,
            registrationNumber,
            semester,
            branch,
            batch,
            section,
            rollNumber,
            academicYear,
          } = row;

          if (!password) {
            console.log(`Skipping user ${email} due to missing password`);
            continue;
          }

          let user = await User.findOne({ email });
          if (user) {
            console.log(`User with email ${email} already exists. Skipping.`);
            continue;
          }

          console.log(`Processing user: ${email}`);
          console.log(`Raw password: ${password}`);

          let storedPassword;
          const passwordIsHashed =
            password.startsWith("$2a$") || password.startsWith("$2b$");

          if (passwordIsHashed) {
            storedPassword = password; // If already hashed, store as-is
          } else {
            storedPassword = password; // Store plaintext password directly
          }

          console.log(`Stored password: ${storedPassword}`);

          user = new User({
            username,
            email,
            password: storedPassword,
            role,
            mobileNumber,
            registrationNumber,
            semester,
            branch,
            batch,
            section,
            batch,
            rollNumber,
            academicYear,
          });

          await user.save();
        }

        res.status(201).json({ msg: "Users registered successfully from CSV" });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};













exports.uploadTimetableCSV = async (req, res) => {
  try {
      const results = [];

      fs.createReadStream(req.file.path)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", async () => {
              for (const row of results) {
                  const {
                      branch,
                      section,
                      semester,
                      batch,
                      timetable,
                      facultyName,
                      subjectName,
                      courseCode,
                      type,
                      time,
                      room,
                      academicYear,
                      session,
                  } = row;

                  const newTimetable = new Timetable({
                      branch,
                      section,
                      semester,
                      batch,
                      timetable,
                      facultyName,
                      subjectName,
                      courseCode,
                      type,
                      time,
                      room,
                      academicYear,
                      session,
                      createdBy: req.user ? req.user._id : null, // Handle absence of req.user
                  });

                  await newTimetable.save();
              }

              res.status(201).json({ msg: "Timetable uploaded successfully from CSV" });
          });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server Error" });
  }
};
