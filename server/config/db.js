const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const seedDemoUsers = async () => {
  try {
    const User = require('../models/User');
    const stakeholderHashedPass = await bcrypt.hash('2312035@nec.edu.in', 10);
    const adminHashedPass = await bcrypt.hash('admin123', 10);

    const pass2312007 = await bcrypt.hash('2312007@nec.edu.in', 10);
    const pass2312013 = await bcrypt.hash('2312013@nec.edu.in', 10);
    const pass2312035 = await bcrypt.hash('2312035@nec.edu.in', 10);

    const demoUsers = [
      {
        email: 'premalalitha08@gmail.com',
        name: 'System Admin',
        businessName: 'VyapaarScore Admin Portal',
        role: 'admin',
        password: adminHashedPass,
        isVerified: true,
      },
      {
        email: '2312035@nec.edu.in',
        name: 'Merchant Partner',
        businessName: 'VyapaarScore Merchant Store',
        role: 'merchant',
        password: pass2312035,
        isVerified: true,
      },
      {
        email: '2312007@nec.edu.in',
        name: 'Bajaj Finserv Micro-Credit',
        businessName: 'Bajaj Finance Ltd',
        phone: '+91 1800 209 0144',
        role: 'lender',
        password: pass2312007,
        isVerified: true,
      },
      {
        email: '2312013@nec.edu.in',
        name: 'Muthoot Microfinance NBFC',
        businessName: 'Muthoot Capital',
        phone: '+91 1800 102 1616',
        role: 'lender',
        password: pass2312013,
        isVerified: true,
      },
      {
        email: 'tata.2312013@nec.edu.in',
        name: 'Tata Capital MSME Growth',
        businessName: 'Tata Capital Financial Services',
        phone: '+91 1860 267 6060',
        role: 'lender',
        password: pass2312013,
        isVerified: true,
      },
      {
        email: 'lt.2312035@nec.edu.in',
        name: 'L&T Finance Micro-Loans',
        businessName: 'L&T Finance Holdings Ltd',
        phone: '+91 1800 209 9800',
        role: 'lender',
        password: pass2312035,
        isVerified: true,
      },
      {
        email: 'shriram.2312007@nec.edu.in',
        name: 'Shriram Finance Micro-Credit',
        businessName: 'Shriram City Union Finance',
        phone: '+91 1800 103 4959',
        role: 'lender',
        password: pass2312007,
        isVerified: true,
      },
    ];

    for (const u of demoUsers) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        await User.create(u);
        console.log(`[SEED SUCCESS] Created test user: ${u.email} (Role: ${u.role})`);
      } else {
        existing.password = u.password;
        existing.role = u.role;
        existing.isVerified = true;
        await existing.save();
        console.log(`[SEED SUCCESS] Updated test user: ${u.email} (Role: ${u.role})`);
      }
    }

    // Clean up duplicate lenders with matching names from database
    const allLenders = await User.find({ role: 'lender' });
    const seenLenderNames = new Set();
    for (const l of allLenders) {
      const key = l.name.trim().toLowerCase();
      if (seenLenderNames.has(key)) {
        await User.deleteOne({ _id: l._id });
        console.log(`[SEED CLEANUP] Deleted duplicate lender: ${l.name} (${l.email})`);
      } else {
        seenLenderNames.add(key);
      }
    }

    // Ensure only premalalitha08@gmail.com is system admin
    await User.updateMany(
      { email: { $ne: 'premalalitha08@gmail.com' }, role: 'admin' },
      { $set: { role: 'merchant' } }
    );
  } catch (err) {
    console.error('[SEED USERS ERROR]', err.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vyapaarscore';
  
  try {
    // Attempt standard connection with 3s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[DB SUCCESS] Connected to MongoDB database at ${uri}`);
    await seedDemoUsers();
  } catch (error) {
    console.warn(`\n==================================================`);
    console.warn(`[DB WARNING] Could not connect to MongoDB at ${uri}.`);
    console.warn(`[DB WARNING] Ensure MongoDB service is running or set MONGODB_URI in server/.env.`);
    console.warn(`==================================================\n`);
  }
};

module.exports = connectDB;

