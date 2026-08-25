require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function makeAllAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // We need to use the User model or just db collection
    const db = mongoose.connection.db;
    const result = await db.collection('users').updateMany({}, { $set: { role: 'admin' } });
    console.log(`Updated ${result.modifiedCount} users to admin.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

makeAllAdmin();
