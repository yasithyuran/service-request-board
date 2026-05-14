require('dotenv').config();
const mongoose = require('mongoose');
const JobRequest = require('./models/JobRequest');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await JobRequest.deleteMany();
    await User.deleteMany();
    
    // Create a demo user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo123'
    });
    
    console.log('Demo user created:', demoUser.email);
    
    const sampleJobs = [
      {
        title: "Leaking kitchen tap",
        description: "Need a plumber for a leaking kitchen tap in Glasgow. Water is dripping constantly.",
        category: "Plumbing",
        location: "Glasgow",
        contactName: "John Smith",
        contactEmail: "john@example.com",
        status: "Open",
        owner: demoUser._id
      },
      {
        title: "Living room painting",
        description: "Need painter for living room, about 20 sq meters. White color, one coat.",
        category: "Painting",
        location: "Edinburgh",
        contactName: "Sarah Johnson",
        contactEmail: "sarah@example.com",
        status: "Open",
        owner: demoUser._id
      },
      {
        title: "Electrical socket installation",
        description: "Need electrician to install 3 new sockets in bedroom.",
        category: "Electrical",
        location: "Glasgow",
        contactName: "Mike Brown",
        contactEmail: "mike@example.com",
        status: "In Progress",
        owner: demoUser._id
      },
      {
        title: "Cabinet repair",
        description: "Kitchen cabinet door hinge broken, need joinery repair.",
        category: "Joinery",
        location: "Aberdeen",
        contactName: "Emma Wilson",
        contactEmail: "emma@example.com",
        status: "Open",
        owner: demoUser._id
      },
      {
        title: "Bathroom renovation",
        description: "Complete bathroom renovation needed including plumbing and tiling.",
        category: "Plumbing",
        location: "Dundee",
        contactName: "David Taylor",
        contactEmail: "david@example.com",
        status: "Closed",
        owner: demoUser._id
      }
    ];
    
    await JobRequest.insertMany(sampleJobs);
    console.log('Database seeded successfully!');
    console.log('Demo credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: demo123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();