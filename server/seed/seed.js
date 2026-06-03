const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Student = require('../models/Student');
const Placement = require('../models/Placement');
const HigherStudy = require('../models/HigherStudy');
const PlacementDrive = require('../models/PlacementDrive');

// ─── Helper: pick a random element from an array ────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ─── Helper: random number in [min, max] ────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Helper: random CGPA between min and max (1 decimal) ────────────────────
const randCgpa = (min, max) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(1));

// ─── Helper: random date between two dates ──────────────────────────────────
const randDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// ─── Constants ──────────────────────────────────────────────────────────────
const BRANCHES = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'ICT', 'CH'];
const BATCHES = ['2020-2024', '2021-2025', '2022-2026'];

// ─── Student Data ───────────────────────────────────────────────────────────
const studentNames = [
  'Aarav Sharma',
  'Priya Patel',
  'Rohan Gupta',
  'Ananya Singh',
  'Vikram Reddy',
  'Neha Verma',
  'Arjun Kumar',
  'Ishita Joshi',
  'Kabir Malhotra',
  'Diya Nair',
  'Aditya Mehta',
  'Pooja Iyer',
  'Rahul Desai',
  'Sneha Chatterjee',
  'Karthik Subramaniam',
  'Meera Pillai',
  'Siddharth Agarwal',
  'Riya Kapoor',
  'Varun Thakur',
  'Nisha Menon',
  'Amit Saxena',
  'Shreya Bose',
  'Deepak Chauhan',
  'Kavya Rao',
  'Manish Jha',
  'Tanvi Kulkarni',
  'Rajesh Pandey',
  'Simran Kaur',
  'Nikhil Srivastava',
  'Ankita Mishra',
  'Harsh Bansal',
  'Divya Nayak',
  'Pranav Chawla',
  'Sakshi Dubey',
  'Gaurav Tiwari',
  'Mridula Das',
  'Saurabh Yadav',
  'Pallavi Hegde',
  'Tushar Goel',
  'Bhavana Rathore',
  'Akash Sinha',
  'Ritika Bhardwaj',
  'Vivek Shukla',
  'Aisha Khan',
  'Kunal Deshpande',
  'Sonal Tripathi',
  'Piyush Chandra',
  'Megha Patil',
  'Dhruv Oberoi',
  'Lavanya Reddy',
];

// ─── Seed Function ──────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://localhost:27017/placement-portal';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // ── Step 1: Clear all collections ──────────────────────────────────────
    console.log('\n🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Placement.deleteMany({}),
      HigherStudy.deleteMany({}),
      PlacementDrive.deleteMany({}),
    ]);
    console.log('   All collections cleared.');

    // ── Step 2: Create Users ───────────────────────────────────────────────
    console.log('\n👤 Creating users...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: 'admin123',
      role: 'admin',
      isApproved: true,
    });
    const studentUser = await User.create({
      name: 'Student User',
      email: 'student@college.edu',
      password: 'student123',
      role: 'student',
      isApproved: true,
    });
    console.log(`   Created admin: ${adminUser.email}`);
    console.log(`   Created student: ${studentUser.email}`);

    // ── Step 3: Create 50 Students ─────────────────────────────────────────
    console.log('\n🎓 Creating students...');
    const students = [];
    for (let i = 0; i < 50; i++) {
      const name = studentNames[i];
      const batch = BATCHES[i % BATCHES.length];
      const branch = BRANCHES[i % BRANCHES.length];
      const batchStartYear = batch.split('-')[0];
      const enrollmentNo = `ENR${batchStartYear}${String(i + 1).padStart(3, '0')}`;
      const firstName = name.split(' ')[0].toLowerCase();
      const lastName = name.split(' ')[1].toLowerCase();
      const email = `${firstName}.${lastName}@college.edu`;
      const phone = `+91 ${rand(70000, 99999)}${rand(10000, 99999)}`;
      const cgpa = randCgpa(6.0, 9.8);

      students.push({
        name,
        enrollmentNo,
        branch,
        batch,
        cgpa,
        email,
        phone,
        status: 'unplaced', // will be updated after placements & higher studies
      });
    }
    const createdStudents = await Student.insertMany(students);
    console.log(`   Created ${createdStudents.length} students.`);

    // ── Step 4: Create 35 Placement Records ────────────────────────────────
    console.log('\n💼 Creating placement records...');
    const placementData = [
      // High packages (25-45 LPA)
      { company: 'Google', role: 'Software Engineer', package: 45, location: 'Bangalore', type: 'on-campus' },
      { company: 'Google', role: 'ML Engineer', package: 42, location: 'Hyderabad', type: 'on-campus' },
      { company: 'Microsoft', role: 'Software Engineer', package: 40, location: 'Hyderabad', type: 'on-campus' },
      { company: 'Microsoft', role: 'Backend Developer', package: 38, location: 'Bangalore', type: 'on-campus' },
      { company: 'Amazon', role: 'Software Engineer', package: 36, location: 'Bangalore', type: 'on-campus' },
      { company: 'Amazon', role: 'DevOps Engineer', package: 34, location: 'Hyderabad', type: 'on-campus' },
      { company: 'Meta', role: 'Frontend Developer', package: 40, location: 'Gurugram', type: 'on-campus' },
      { company: 'Apple', role: 'Software Engineer', package: 38, location: 'Bangalore', type: 'off-campus' },
      { company: 'Goldman Sachs', role: 'Software Engineer', package: 35, location: 'Bangalore', type: 'on-campus' },
      { company: 'Morgan Stanley', role: 'Data Analyst', package: 28, location: 'Mumbai', type: 'on-campus' },
      { company: 'Uber', role: 'Backend Developer', package: 32, location: 'Bangalore', type: 'on-campus' },
      { company: 'Adobe', role: 'Software Engineer', package: 30, location: 'Noida', type: 'on-campus' },

      // Medium packages (8-24 LPA)
      { company: 'Deloitte', role: 'Consultant', package: 18, location: 'Mumbai', type: 'on-campus' },
      { company: 'Accenture', role: 'Business Analyst', package: 12, location: 'Pune', type: 'on-campus' },
      { company: 'Samsung', role: 'Software Engineer', package: 22, location: 'Bangalore', type: 'on-campus' },
      { company: 'Qualcomm', role: 'Software Engineer', package: 20, location: 'Hyderabad', type: 'on-campus' },
      { company: 'Intel', role: 'Software Engineer', package: 18, location: 'Bangalore', type: 'on-campus' },
      { company: 'Oracle', role: 'Backend Developer', package: 16, location: 'Bangalore', type: 'on-campus' },
      { company: 'SAP', role: 'Software Engineer', package: 15, location: 'Bangalore', type: 'on-campus' },
      { company: 'Cisco', role: 'Software Engineer', package: 17, location: 'Bangalore', type: 'on-campus' },
      { company: 'VMware', role: 'Software Engineer', package: 19, location: 'Pune', type: 'on-campus' },
      { company: 'PayPal', role: 'Frontend Developer', package: 21, location: 'Chennai', type: 'on-campus' },

      // Lower packages (3-8 LPA)
      { company: 'TCS', role: 'Software Engineer', package: 7, location: 'Mumbai', type: 'on-campus' },
      { company: 'TCS', role: 'QA Engineer', package: 5, location: 'Pune', type: 'on-campus' },
      { company: 'Infosys', role: 'Software Engineer', package: 6.5, location: 'Mysore', type: 'on-campus' },
      { company: 'Infosys', role: 'Business Analyst', package: 5.5, location: 'Pune', type: 'on-campus' },
      { company: 'Wipro', role: 'Software Engineer', package: 5, location: 'Bangalore', type: 'on-campus' },
      { company: 'Cognizant', role: 'Software Engineer', package: 6, location: 'Chennai', type: 'on-campus' },
      { company: 'Tech Mahindra', role: 'Software Engineer', package: 4.5, location: 'Hyderabad', type: 'on-campus' },
      { company: 'HCL', role: 'Software Engineer', package: 5, location: 'Noida', type: 'on-campus' },
      { company: 'Capgemini', role: 'Software Engineer', package: 7.5, location: 'Mumbai', type: 'on-campus' },
      { company: 'LTIMindtree', role: 'Software Engineer', package: 6, location: 'Pune', type: 'on-campus' },

      // Additional entries with varied types
      { company: 'Google', role: 'Product Manager', package: 44, location: 'Bangalore', type: 'internship' },
      { company: 'Deloitte', role: 'Data Analyst', package: 14, location: 'Delhi NCR', type: 'off-campus' },
      { company: 'Accenture', role: 'Consultant', package: 10, location: 'Gurugram', type: 'off-campus' },
    ];

    const placements = placementData.map((p, index) => ({
      studentId: createdStudents[index]._id,
      company: p.company,
      role: p.role,
      package: p.package,
      placementType: p.type,
      placementDate: randDate(new Date('2024-01-01'), new Date('2025-06-30')),
      location: p.location,
    }));

    const createdPlacements = await Placement.insertMany(placements);
    console.log(`   Created ${createdPlacements.length} placement records.`);

    // ── Step 5: Create 15 Higher Studies Records ───────────────────────────
    console.log('\n📚 Creating higher studies records...');
    const higherStudiesData = [
      // USA Universities
      { university: 'Massachusetts Institute of Technology (MIT)', country: 'USA', program: 'MS', admissionYear: 2025 },
      { university: 'Stanford University', country: 'USA', program: 'MS', admissionYear: 2025 },
      { university: 'Carnegie Mellon University', country: 'USA', program: 'MS', admissionYear: 2025 },
      { university: 'Georgia Institute of Technology', country: 'USA', program: 'MS', admissionYear: 2024 },
      { university: 'University of California, Berkeley', country: 'USA', program: 'PhD', admissionYear: 2025 },
      { university: 'University of Michigan', country: 'USA', program: 'MS', admissionYear: 2024 },
      { university: 'Purdue University', country: 'USA', program: 'MS', admissionYear: 2024 },

      // Canada
      { university: 'University of Toronto', country: 'Canada', program: 'MS', admissionYear: 2025 },
      { university: 'University of Waterloo', country: 'Canada', program: 'MS', admissionYear: 2025 },

      // Germany
      { university: 'Technical University of Munich (TU Munich)', country: 'Germany', program: 'MS', admissionYear: 2025 },

      // India – MTech / MBA / PhD
      { university: 'IIT Bombay', country: 'India', program: 'MTech', admissionYear: 2024 },
      { university: 'IIT Delhi', country: 'India', program: 'MTech', admissionYear: 2024 },
      { university: 'IIT Madras', country: 'India', program: 'PhD', admissionYear: 2025 },
      { university: 'IIM Ahmedabad', country: 'India', program: 'MBA', admissionYear: 2025 },
      { university: 'IIM Bangalore', country: 'India', program: 'MBA', admissionYear: 2024 },
    ];

    // Assign higher studies to students who don't already have a placement
    // Students at indices 35–49 are unplaced (placements used indices 0–34)
    const higherStudies = higherStudiesData.map((hs, index) => ({
      studentId: createdStudents[35 + index]._id,
      university: hs.university,
      country: hs.country,
      program: hs.program,
      admissionYear: hs.admissionYear,
    }));

    const createdHigherStudies = await HigherStudy.insertMany(higherStudies);
    console.log(
      `   Created ${createdHigherStudies.length} higher studies records.`
    );

    // ── Step 6: Create 5 Placement Drives ──────────────────────────────────
    console.log('\n🚀 Creating placement drives...');
    const drivesData = [
      {
        company: 'Google',
        package: 45,
        eligibility:
          'B.Tech CSE/IT/ECE with CGPA ≥ 8.0. No active backlogs. Strong DSA and problem-solving skills required.',
        deadline: new Date('2025-08-15'),
        description:
          'Google is hiring Software Engineers for their Bangalore and Hyderabad offices. The selection process includes an online coding round, 2 technical interviews, and 1 HR interview. Roles span across Search, Cloud, and YouTube teams.',
        status: 'active',
      },
      {
        company: 'Microsoft',
        package: 40,
        eligibility:
          'B.Tech all branches with CGPA ≥ 7.5. No active backlogs. Proficiency in at least one programming language.',
        deadline: new Date('2025-09-01'),
        description:
          'Microsoft India Development Center is conducting campus recruitment for Software Engineer roles. Process: Online Assessment → Group Fly Round → 3 Technical Interviews → HR. Positions available in Azure, Office 365, and Teams divisions.',
        status: 'active',
      },
      {
        company: 'Amazon',
        package: 35,
        eligibility:
          'B.Tech CSE/IT/ECE/EE with CGPA ≥ 7.0. No active backlogs. Knowledge of OOP, system design basics preferred.',
        deadline: new Date('2025-07-20'),
        description:
          'Amazon is hiring SDE-1 for their Bangalore and Hyderabad development centers. The hiring process consists of an online assessment (2 coding questions + work simulation), followed by 4 rounds of interviews focusing on leadership principles and technical depth.',
        status: 'active',
      },
      {
        company: 'Deloitte',
        package: 12,
        eligibility:
          'B.Tech all branches with CGPA ≥ 6.5. No active backlogs. Strong analytical and communication skills.',
        deadline: new Date('2025-10-10'),
        description:
          'Deloitte USI is hiring Analyst Trainees and Business Technology Analysts. Selection: Aptitude Test → Group Discussion → Technical Interview → HR Interview. Roles available in consulting, audit, and technology advisory practice areas.',
        status: 'active',
      },
      {
        company: 'TCS',
        package: 7,
        eligibility:
          'B.Tech all branches with CGPA ≥ 6.0. No active backlogs. Willingness to relocate across India.',
        deadline: new Date('2025-11-01'),
        description:
          'TCS National Qualifier Test (NQT) based hiring for System Engineer and Digital roles. The NQT consists of aptitude, programming, and coding sections. Selected candidates will undergo the TCS Initial Learning Program (ILP) at Trivandrum before project allocation.',
        status: 'active',
      },
    ];

    const createdDrives = await PlacementDrive.insertMany(drivesData);
    console.log(`   Created ${createdDrives.length} placement drives.`);

    // ── Step 7: Update Student Statuses ────────────────────────────────────
    console.log('\n🔄 Updating student statuses...');

    // Mark students with placement records as 'placed' (indices 0–34)
    const placedStudentIds = createdStudents
      .slice(0, 35)
      .map((s) => s._id);
    await Student.updateMany(
      { _id: { $in: placedStudentIds } },
      { status: 'placed' }
    );
    console.log(`   Marked ${placedStudentIds.length} students as "placed".`);

    // Mark students with higher studies records as 'higher_studies' (indices 35–49)
    const higherStudyStudentIds = createdStudents
      .slice(35, 50)
      .map((s) => s._id);
    await Student.updateMany(
      { _id: { $in: higherStudyStudentIds } },
      { status: 'higher_studies' }
    );
    console.log(
      `   Marked ${higherStudyStudentIds.length} students as "higher_studies".`
    );

    // ── Step 8: Summary ────────────────────────────────────────────────────
    const [userCount, studentCount, placementCount, hsCount, driveCount] =
      await Promise.all([
        User.countDocuments(),
        Student.countDocuments(),
        Placement.countDocuments(),
        HigherStudy.countDocuments(),
        PlacementDrive.countDocuments(),
      ]);

    console.log('\n' + '═'.repeat(50));
    console.log('  📊  SEED SUMMARY');
    console.log('═'.repeat(50));
    console.log(`  👤  Users            : ${userCount}`);
    console.log(`  🎓  Students         : ${studentCount}`);
    console.log(`  💼  Placements       : ${placementCount}`);
    console.log(`  📚  Higher Studies   : ${hsCount}`);
    console.log(`  🚀  Placement Drives : ${driveCount}`);
    console.log('═'.repeat(50));
    console.log('\n✅ Database seeded successfully!\n');

    // ── Disconnect & exit ──────────────────────────────────────────────────
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seed
seedDatabase();
