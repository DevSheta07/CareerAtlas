const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Student = require('../models/Student');
const Placement = require('../models/Placement');
const HigherStudy = require('../models/HigherStudy');
const PlacementDrive = require('../models/PlacementDrive');

// ─── Helper Functions ────────────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randCgpa = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const randDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// ─── Constants for Data Generation ──────────────────────────────────────────
const BRANCHES = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'ICT', 'CH'];
const BATCHES = ['2020-2024', '2021-2025', '2022-2026'];

const FIRST_NAMES = [
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Neha', 'Arjun', 'Ishita', 'Kabir', 'Diya',
  'Aditya', 'Pooja', 'Rahul', 'Sneha', 'Karthik', 'Meera', 'Siddharth', 'Riya', 'Varun', 'Nisha',
  'Amit', 'Shreya', 'Deepak', 'Kavya', 'Manish', 'Tanvi', 'Rajesh', 'Simran', 'Nikhil', 'Ankita',
  'Harsh', 'Divya', 'Pranav', 'Sakshi', 'Gaurav', 'Mridula', 'Saurabh', 'Pallavi', 'Tushar', 'Bhavana',
  'Akash', 'Ritika', 'Vivek', 'Aisha', 'Kunal', 'Sonal', 'Piyush', 'Megha', 'Dhruv', 'Lavanya',
  'Abhishek', 'Aishwarya', 'Aniket', 'Bhumika', 'Chaitanya', 'Devendra', 'Gitanjali', 'Himanshu', 'Jyoti', 'Karan',
  'Kiran', 'Lalit', 'Manoj', 'Nidhi', 'Pradeep', 'Priyanka', 'Raj', 'Ritu', 'Sandeep', 'Swati',
  'Tarun', 'Urvashi', 'Vinay', 'Yash', 'Zoya', 'Alok', 'Bhavya', 'Chirag', 'Dolly', 'Eshwar'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Gupta', 'Singh', 'Reddy', 'Verma', 'Kumar', 'Joshi', 'Malhotra', 'Nair',
  'Mehta', 'Iyer', 'Desai', 'Chatterjee', 'Subramaniam', 'Pillai', 'Agarwal', 'Kapoor', 'Thakur', 'Menon',
  'Saxena', 'Bose', 'Chauhan', 'Rao', 'Jha', 'Kulkarni', 'Pandey', 'Kaur', 'Srivastava', 'Mishra',
  'Bansal', 'Nayak', 'Chawla', 'Dubey', 'Tiwari', 'Das', 'Yadav', 'Hegde', 'Goel', 'Rathore',
  'Sinha', 'Bhardwaj', 'Shukla', 'Khan', 'Deshpande', 'Tripathi', 'Chandra', 'Patil', 'Oberoi', 'Sen'
];

const COMPANIES = [
  // High Tier (25 - 50 LPA)
  { name: 'Google', roles: ['Software Engineer', 'ML Engineer', 'Product Manager', 'Site Reliability Engineer'], minPackage: 35, maxPackage: 52, locations: ['Bangalore', 'Hyderabad', 'Pune'] },
  { name: 'Microsoft', roles: ['Software Engineer', 'Backend Developer', 'Data Scientist', 'Program Manager'], minPackage: 30, maxPackage: 45, locations: ['Hyderabad', 'Bangalore', 'Noida'] },
  { name: 'Amazon', roles: ['Software Development Engineer', 'Cloud Support Engineer', 'Operations Analyst'], minPackage: 26, maxPackage: 40, locations: ['Bangalore', 'Hyderabad', 'Chennai'] },
  { name: 'Meta', roles: ['Frontend Engineer', 'Software Engineer', 'Data Engineer'], minPackage: 38, maxPackage: 48, locations: ['Gurugram', 'Remote'] },
  { name: 'Apple', roles: ['iOS Developer', 'Software Engineer', 'Hardware Engineer'], minPackage: 32, maxPackage: 46, locations: ['Bangalore', 'Hyderabad'] },
  { name: 'Netflix', roles: ['Senior Software Engineer', 'UI Engineer'], minPackage: 40, maxPackage: 55, locations: ['Mumbai', 'Remote'] },
  { name: 'Uber', roles: ['Backend Engineer', 'Systems Engineer'], minPackage: 28, maxPackage: 42, locations: ['Bangalore'] },
  { name: 'Salesforce', roles: ['SDE-1', 'Systems Analyst'], minPackage: 24, maxPackage: 36, locations: ['Hyderabad', 'Bangalore'] },
  { name: 'Nvidia', roles: ['GPU Architecture Engineer', 'Software Engineer'], minPackage: 28, maxPackage: 44, locations: ['Bangalore', 'Pune'] },
  { name: 'Adobe', roles: ['Product Engineer', 'Software Engineer'], minPackage: 25, maxPackage: 38, locations: ['Noida', 'Bangalore'] },
  
  // Mid Tier (8 - 24 LPA)
  { name: 'Deloitte', roles: ['Consultant', 'Technology Analyst', 'Risk Advisory Consultant'], minPackage: 10, maxPackage: 18, locations: ['Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune'] },
  { name: 'Accenture', roles: ['Business Analyst', 'Associate Software Engineer', 'Consultant'], minPackage: 8, maxPackage: 14, locations: ['Pune', 'Gurugram', 'Chennai', 'Mumbai'] },
  { name: 'Samsung', roles: ['Research Engineer', 'Software Engineer'], minPackage: 14, maxPackage: 24, locations: ['Bangalore', 'Noida'] },
  { name: 'Qualcomm', roles: ['Modem Engineer', 'Systems Software Engineer'], minPackage: 16, maxPackage: 26, locations: ['Hyderabad', 'Bangalore'] },
  { name: 'Intel', roles: ['Firmware Engineer', 'Software Developer'], minPackage: 12, maxPackage: 22, locations: ['Bangalore'] },
  { name: 'Oracle', roles: ['Database Engineer', 'Cloud Developer'], minPackage: 12, maxPackage: 20, locations: ['Bangalore', 'Hyderabad', 'Noida'] },
  { name: 'SAP', roles: ['Developer Associate', 'Support Engineer'], minPackage: 10, maxPackage: 18, locations: ['Bangalore', 'Pune'] },
  { name: 'Cisco', roles: ['Network Engineer', 'Software Engineer'], minPackage: 14, maxPackage: 22, locations: ['Bangalore', 'Chennai'] },
  { name: 'VMware', roles: ['Cloud Engineer', 'Software Developer'], minPackage: 15, maxPackage: 22, locations: ['Pune', 'Bangalore'] },
  { name: 'PayPal', roles: ['Software Engineer', 'Risk Analyst'], minPackage: 16, maxPackage: 25, locations: ['Chennai', 'Bangalore'] },
  { name: 'Goldman Sachs', roles: ['Analyst', 'Software Engineer'], minPackage: 20, maxPackage: 28, locations: ['Bangalore'] },
  { name: 'Morgan Stanley', roles: ['Technology Analyst', 'Application Developer'], minPackage: 18, maxPackage: 26, locations: ['Mumbai', 'Bangalore'] },
  
  // Service / Mass Recruiters (3.5 - 7.5 LPA)
  { name: 'TCS', roles: ['Assistant System Engineer', 'Systems Engineer (Digital)'], minPackage: 4, maxPackage: 7.5, locations: ['Mumbai', 'Pune', 'Kolkata', 'Chennai'] },
  { name: 'Infosys', roles: ['System Engineer', 'Power Programmer'], minPackage: 3.6, maxPackage: 8, locations: ['Mysore', 'Pune', 'Bangalore', 'Hyderabad'] },
  { name: 'Wipro', roles: ['Project Engineer', 'Turbo Candidate'], minPackage: 3.5, maxPackage: 6.5, locations: ['Bangalore', 'Pune', 'Kochi'] },
  { name: 'Cognizant', roles: ['Programmer Analyst', 'GenC Next Developer'], minPackage: 4, maxPackage: 7, locations: ['Chennai', 'Kolkata', 'Coimbatore'] },
  { name: 'Tech Mahindra', roles: ['Associate Software Engineer'], minPackage: 3.5, maxPackage: 5.5, locations: ['Hyderabad', 'Pune', 'Noida'] },
  { name: 'HCLTech', roles: ['Graduate Engineer Trainee'], minPackage: 3.6, maxPackage: 6, locations: ['Noida', 'Chennai', 'Lucknow'] },
  { name: 'Capgemini', roles: ['Senior Analyst', 'Software Engineer'], minPackage: 4.2, maxPackage: 7.5, locations: ['Mumbai', 'Pune', 'Bangalore'] },
  { name: 'LTIMindtree', roles: ['Software Engineer'], minPackage: 4, maxPackage: 6.5, locations: ['Pune', 'Mumbai', 'Bangalore'] }
];

const HIGHER_STUDIES_UNIVERSITIES = [
  { university: 'Massachusetts Institute of Technology (MIT)', country: 'USA', programs: ['MS', 'PhD'] },
  { university: 'Stanford University', country: 'USA', programs: ['MS', 'PhD', 'MBA'] },
  { university: 'Carnegie Mellon University', country: 'USA', programs: ['MS'] },
  { university: 'Georgia Institute of Technology', country: 'USA', programs: ['MS'] },
  { university: 'University of California, Berkeley', country: 'USA', programs: ['MS', 'PhD'] },
  { university: 'University of Michigan', country: 'USA', programs: ['MS'] },
  { university: 'Purdue University', country: 'USA', programs: ['MS'] },
  { university: 'University of Toronto', country: 'Canada', programs: ['MS', 'PhD'] },
  { university: 'University of Waterloo', country: 'Canada', programs: ['MS'] },
  { university: 'Technical University of Munich (TU Munich)', country: 'Germany', programs: ['MS'] },
  { university: 'IIT Bombay', country: 'India', programs: ['MTech', 'PhD'] },
  { university: 'IIT Delhi', country: 'India', programs: ['MTech', 'PhD'] },
  { university: 'IIT Madras', country: 'India', programs: ['MTech', 'PhD'] },
  { university: 'IIM Ahmedabad', country: 'India', programs: ['MBA'] },
  { university: 'IIM Bangalore', country: 'India', programs: ['MBA'] },
  { university: 'University of Oxford', country: 'UK', programs: ['MS', 'PhD'] },
  { university: 'University of Cambridge', country: 'UK', programs: ['MS', 'PhD'] }
];

// ─── Seed Function ──────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/placement-portal';
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

    // ── Step 3: Create 520 Students with Unique Names ─────────────────────
    console.log('\n🎓 Generating 520 students...');
    const students = [];
    const generatedNames = new Set();

    while (generatedNames.size < 520) {
      const fName = pick(FIRST_NAMES);
      const lName = pick(LAST_NAMES);
      const fullName = `${fName} ${lName}`;
      generatedNames.add(fullName);
    }

    const uniqueNamesArray = Array.from(generatedNames);

    for (let i = 0; i < 520; i++) {
      const name = uniqueNamesArray[i];
      const batch = BATCHES[i % BATCHES.length];
      const branch = BRANCHES[i % BRANCHES.length];
      const batchStartYear = batch.split('-')[0];
      const enrollmentNo = `ENR${batchStartYear}${String(i + 1).padStart(3, '0')}`;
      const firstName = name.split(' ')[0].toLowerCase();
      const lastName = name.split(' ')[1].toLowerCase();
      
      // Handle potential email collisions by adding a index suffix
      const email = `${firstName}.${lastName}.${i + 1}@college.edu`;
      const phone = `+91 ${rand(7000, 9999)}${rand(10000, 99999)}`;
      
      // Make CGPA realistic: most students between 6.5 and 9.0, some high, some low
      let cgpa;
      const cgpaRand = Math.random();
      if (cgpaRand > 0.92) {
        cgpa = randCgpa(9.0, 10.0); // Top performers
      } else if (cgpaRand > 0.40) {
        cgpa = randCgpa(7.0, 8.99); // Mid-high range
      } else if (cgpaRand > 0.10) {
        cgpa = randCgpa(6.0, 6.99); // Average range
      } else {
        cgpa = randCgpa(5.0, 5.99); // Low range
      }

      students.push({
        name,
        enrollmentNo,
        branch,
        batch,
        cgpa,
        email,
        phone,
        status: 'unplaced', // will be updated dynamically below
      });
    }

    const createdStudents = await Student.insertMany(students);
    console.log(`   Successfully created ${createdStudents.length} students.`);

    // ── Step 4: Distribute statuses ────────────────────────────────────────
    // Let's divide:
    // ~70% (364 students) placed
    // ~15% (78 students) higher studies
    // ~15% (78 students) unplaced
    const studentCount = createdStudents.length;
    const numPlaced = Math.floor(studentCount * 0.70); // 364
    const numHigherStudies = Math.floor(studentCount * 0.15); // 78

    const shuffledStudents = [...createdStudents].sort(() => 0.5 - Math.random());
    const placedPool = shuffledStudents.slice(0, numPlaced);
    const higherStudiesPool = shuffledStudents.slice(numPlaced, numPlaced + numHigherStudies);
    const unplacedPool = shuffledStudents.slice(numPlaced + numHigherStudies);

    // ── Step 5: Create Placement Records ────────────────────────────────────
    console.log('\n💼 Creating placement records...');
    const placements = [];

    for (const student of placedPool) {
      // Determine what tiers of company the student qualifies for based on CGPA
      // Higher CGPA -> better chance of High Tier package
      let availableCompanies;
      const cgpa = student.cgpa;

      if (cgpa >= 8.5) {
        // High Tier + Mid Tier
        availableCompanies = COMPANIES.filter(c => c.minPackage >= 24 || (c.minPackage >= 8 && c.maxPackage <= 28));
      } else if (cgpa >= 7.0) {
        // Mid Tier + Mass Recruiters
        availableCompanies = COMPANIES.filter(c => c.minPackage < 25);
      } else {
        // Mostly Mass Recruiters, occasionally a mid tier
        availableCompanies = COMPANIES.filter(c => c.minPackage < 8 || c.name === 'Deloitte' || c.name === 'Accenture');
      }

      // If for some reason the filter is empty, fallback to all companies
      if (availableCompanies.length === 0) {
        availableCompanies = COMPANIES;
      }

      const comp = pick(availableCompanies);
      const role = pick(comp.roles);
      const packageAmt = parseFloat((Math.random() * (comp.maxPackage - comp.minPackage) + comp.minPackage).toFixed(2));
      const location = pick(comp.locations);
      const placementType = pick(['on-campus', 'on-campus', 'on-campus', 'off-campus', 'internship']); // mostly on-campus
      const placementDate = randDate(new Date('2024-01-01'), new Date('2025-06-01'));

      placements.push({
        studentId: student._id,
        company: comp.name,
        role,
        package: packageAmt,
        placementType,
        placementDate,
        location,
      });
    }

    const createdPlacements = await Placement.insertMany(placements);
    console.log(`   Successfully created ${createdPlacements.length} placement records.`);

    // ── Step 6: Create Higher Studies Records ───────────────────────────────
    console.log('\n📚 Creating higher studies records...');
    const higherStudies = [];

    for (const student of higherStudiesPool) {
      const hs = pick(HIGHER_STUDIES_UNIVERSITIES);
      const program = pick(hs.programs);
      
      // Determine admission year based on batch
      const endYear = parseInt(student.batch.split('-')[1]);
      const admissionYear = pick([endYear, endYear + 1]);

      higherStudies.push({
        studentId: student._id,
        university: hs.university,
        country: hs.country,
        program,
        admissionYear,
      });
    }

    const createdHigherStudies = await HigherStudy.insertMany(higherStudies);
    console.log(`   Successfully created ${createdHigherStudies.length} higher studies records.`);

    // ── Step 7: Update Student Statuses ────────────────────────────────────
    console.log('\n🔄 Updating student statuses on Student collection...');
    
    const placedStudentIds = placedPool.map(s => s._id);
    await Student.updateMany(
      { _id: { $in: placedStudentIds } },
      { status: 'placed' }
    );

    const higherStudyStudentIds = higherStudiesPool.map(s => s._id);
    await Student.updateMany(
      { _id: { $in: higherStudyStudentIds } },
      { status: 'higher_studies' }
    );

    console.log(`   Updated ${placedStudentIds.length} students to "placed".`);
    console.log(`   Updated ${higherStudyStudentIds.length} students to "higher_studies".`);
    console.log(`   Left ${unplacedPool.length} students as "unplaced".`);

    // ── Step 8: Create Placement Drives ──────────────────────────────────
    console.log('\n🚀 Creating placement drives...');
    const drivesData = [
      {
        company: 'Google',
        package: 45,
        eligibility: 'B.Tech CSE/IT/ECE with CGPA ≥ 8.0. No active backlogs. Strong DSA and problem-solving skills required.',
        deadline: new Date('2026-08-15'),
        description: 'Google is hiring Software Engineers for Bangalore and Hyderabad. Process: Coding Assessment → 3 Technical rounds.',
        status: 'active',
      },
      {
        company: 'Microsoft',
        package: 40,
        eligibility: 'B.Tech all branches with CGPA ≥ 7.5. Strong design and coding fundamentals.',
        deadline: new Date('2026-09-01'),
        description: 'Recruiting for Software Engineer roles at Microsoft India Development Center. Focus areas: Azure, Developer Division.',
        status: 'active',
      },
      {
        company: 'Amazon',
        package: 36,
        eligibility: 'B.Tech/M.Tech with CGPA ≥ 7.0. Solid knowledge of OOP and Algorithms.',
        deadline: new Date('2026-07-20'),
        description: 'Amazon is hiring SDE-1 for Hyderabad, Bangalore, Chennai. Process: Online assessment → 3 rounds of virtual interviews.',
        status: 'active',
      },
      {
        company: 'Nvidia',
        package: 42,
        eligibility: 'B.Tech CSE/ECE/EE with CGPA ≥ 8.0. Deep C++ and OS fundamentals.',
        deadline: new Date('2026-08-30'),
        description: 'Nvidia is hiring System Software Engineers. Focus on graphics, AI acceleration, and system level design.',
        status: 'active',
      },
      {
        company: 'Deloitte',
        package: 12,
        eligibility: 'B.Tech all branches with CGPA ≥ 6.5. Strong analytical and communication skills.',
        deadline: new Date('2026-10-10'),
        description: 'Deloitte USI hiring for Technology Analyst roles. Selection process: Online aptitude → Case study discussion → Partner interview.',
        status: 'active',
      },
      {
        company: 'Accenture',
        package: 9,
        eligibility: 'All graduates with CGPA ≥ 6.0. Basic programming awareness.',
        deadline: new Date('2026-09-15'),
        description: 'Hiring Associate Software Engineers. Roles involve full-stack development, cloud migration, and tech consulting.',
        status: 'active',
      },
      {
        company: 'TCS',
        package: 7.5,
        eligibility: 'All branches with CGPA ≥ 6.0. Online assessment and technical interview.',
        deadline: new Date('2026-06-30'),
        description: 'TCS National Qualifier Test (NQT) for Digital and Ninja roles. Wide scale hiring for fresh engineering graduates.',
        status: 'active',
      },
      {
        company: 'Samsung',
        package: 22,
        eligibility: 'B.Tech CSE/IT/ECE with CGPA ≥ 7.5.',
        deadline: new Date('2025-11-20'),
        description: 'Samsung Research Institute Bangalore is hiring Research Engineers for AI/ML and 5G/6G domain projects.',
        status: 'completed',
      },
      {
        company: 'Qualcomm',
        package: 20,
        eligibility: 'B.Tech ECE/EE/CSE with CGPA ≥ 8.0.',
        deadline: new Date('2025-12-05'),
        description: 'Hiring Systems Engineers. Requires knowledge of digital signal processing, embedded systems, and communication theory.',
        status: 'completed',
      },
      {
        company: 'Intel',
        package: 18,
        eligibility: 'B.Tech/M.Tech with CGPA ≥ 7.0.',
        deadline: new Date('2026-01-15'),
        description: 'Hiring Firmware Engineers. Strong C programming, hardware debugging, and microcontroller knowledge needed.',
        status: 'completed',
      },
      {
        company: 'Salesforce',
        package: 30,
        eligibility: 'B.Tech CSE/IT with CGPA ≥ 8.0.',
        deadline: new Date('2026-03-01'),
        description: 'Hiring AMTS (Associate Member of Technical Staff). Focus on enterprise SaaS software development.',
        status: 'completed',
      },
      {
        company: 'Netflix',
        package: 48,
        eligibility: 'B.Tech with CGPA ≥ 9.0 or exceptional Open Source contributions.',
        deadline: new Date('2026-05-10'),
        description: 'Special off-campus hiring for Media systems engineers and backend developers.',
        status: 'cancelled',
      }
    ];

    const createdDrives = await PlacementDrive.insertMany(drivesData);
    console.log(`   Successfully created ${createdDrives.length} placement drives.`);

    // ── Step 9: Print Seed Statistics Summary ──────────────────────────────
    const [userCount, finalStudentCount, finalPlacementCount, finalHsCount, finalDriveCount] =
      await Promise.all([
        User.countDocuments(),
        Student.countDocuments(),
        Placement.countDocuments(),
        HigherStudy.countDocuments(),
        PlacementDrive.countDocuments(),
      ]);

    console.log('\n' + '═'.repeat(50));
    console.log('  📊  SEED DATA GENERATION SUMMARY');
    console.log('═'.repeat(50));
    console.log(`  👤  Users            : ${userCount}`);
    console.log(`  🎓  Students         : ${finalStudentCount}`);
    console.log(`  💼  Placements       : ${finalPlacementCount}`);
    console.log(`  📚  Higher Studies   : ${finalHsCount}`);
    console.log(`  🚀  Placement Drives : ${finalDriveCount}`);
    console.log('═'.repeat(50));
    console.log('\n✅ Database successfully populated with 500+ records!\n');

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

// Execute the seeding script
seedDatabase();
