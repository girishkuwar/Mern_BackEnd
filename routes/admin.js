const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const Upload = require("../models/Upload");
const router = express.Router();
const User = require('../models/User');
const ExcelsData = require('../models/ExcelData');

// ✅ 1. Get all upload history
router.get("/uploads", auth, adminOnly, async (req, res) => {
  try {
    const uploads = await ExcelsData.find()
      .populate("user", "username email")
      .sort({ uploadedAt: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching uploads" });
  }
});

// ✅ 2. Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUploads = await ExcelsData.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" }); // optional field
    res.json({ totalUsers, activeUsers, totalUploads });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 3. Get users with their upload count
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude passwords

    const usersWithUploads = await Promise.all(
      users.map(async user => {
        const uploadCount = await ExcelsData.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          uploadCount,
        };
      })
    );

    res.json(usersWithUploads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 4. Update user role (admin/user)
router.put('/users/:id/role', auth, adminOnly, async (req, res) => {
  const { role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const requestingUser = req.user; // ✅ use the authenticated user directly

    // Restrict assigning admin role unless canCreateAdmin is true
    if (role === 'admin' && !requestingUser.canCreateAdmin) {
      return res.status(403).json({ error: 'Not authorized to assign admin role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ msg: 'User role updated successfully', user });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ 5. Delete user by ID (with admin protection)
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ❌ Prevent deleting users who are admins with canCreateAdmin
    if (userToDelete.role === 'admin' && userToDelete.canCreateAdmin) {
      return res.status(403).json({ error: 'Cannot delete a super admin user' });
    }

    await User.findByIdAndDelete(req.params.id);

    // Optionally delete their uploads
    await ExcelsData.deleteMany({ user: req.params.id });

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
