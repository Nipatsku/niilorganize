const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;

// Manual generation of admin users
const addAdmin = async (label, password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const newAdmin = new Admin({ label, password: hash })
  await newAdmin.save();
  console.log(`Added new admin`)
}
// addAdmin('Niilo', 'test')

module.exports.checkAdminAuth = async (passwordAttempt) => {
  const admins = await Admin.find({})
  for (const admin of admins) {
    const match = await bcrypt.compare(passwordAttempt, admin.password)
    if (match) {
      return admin
    }
  }
  return false
}
