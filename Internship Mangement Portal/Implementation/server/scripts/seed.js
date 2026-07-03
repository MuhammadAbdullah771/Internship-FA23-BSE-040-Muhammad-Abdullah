import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { User } from '../models/User.js';
import { Intern } from '../models/Intern.js';
import { Task } from '../models/Task.js';
import { InternshipPosting } from '../models/InternshipPosting.js';
import { ROLES } from '../constants/roles.js';

dotenv.config();

const SEED_USERS = [
  {
    email: 'superadmin@internhub.io',
    passwordHash: 'superadmin123',
    firstName: 'Super',
    lastName: 'Admin',
    role: ROLES.SUPERADMIN,
    avatar: 'https://i.pravatar.cc/150?u=superadmin',
  },
  {
    email: 'alex.mercer@example.com',
    passwordHash: 'student123',
    firstName: 'Alex',
    lastName: 'Mercer',
    role: ROLES.STUDENT,
    avatar: 'https://i.pravatar.cc/150?u=alex',
  },
];

const SEED_INTERNS = [
  {
    firstName: 'Alex',
    lastName: 'Mercer',
    email: 'alex.m@internhub.io',
    track: 'Software Engineering',
    status: 'Active',
    department: 'Engineering',
    intake: '2024',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    linkUserEmail: 'alex.mercer@example.com',
  },
  {
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.c@internhub.io',
    track: 'Product Design',
    status: 'Onboarding',
    department: 'Design',
    intake: '2024',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.j@internhub.io',
    track: 'Marketing',
    status: 'Completed',
    department: 'Marketing',
    intake: '2023',
    avatar: '',
  },
  {
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.k@internhub.io',
    track: 'Data Science',
    status: 'Active',
    department: 'Engineering',
    intake: '2024',
    avatar: 'https://i.pravatar.cc/150?u=david',
  },
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.s@internhub.io',
    track: 'Frontend Development',
    status: 'Onboarding',
    department: 'Engineering',
    intake: '2025',
    avatar: 'https://i.pravatar.cc/150?u=priya',
  },
  {
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.w@internhub.io',
    track: 'Digital Marketing',
    status: 'Active',
    department: 'Marketing',
    intake: '2025',
    avatar: 'https://i.pravatar.cc/150?u=james',
  },
];

const SEED_POSTINGS = [
  { title: 'Frontend Development', duration: '8 Weeks', level: 'Beginner', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop', tags: ['React', 'JavaScript', 'CSS'], trending: true },
  { title: 'Backend Development', duration: '10 Weeks', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=240&fit=crop', tags: ['Node.js', 'MongoDB', 'API'], trending: true },
  { title: 'UI/UX Design', duration: '6 Weeks', level: 'Beginner', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=240&fit=crop', tags: ['Figma', 'Prototyping', 'Research'], trending: false },
  { title: 'Data Science', duration: '12 Weeks', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop', tags: ['Python', 'ML', 'Analytics'], trending: true },
  { title: 'Mobile App Development', duration: '10 Weeks', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=240&fit=crop', tags: ['Flutter', 'Dart', 'Firebase'], trending: false },
  { title: 'Digital Marketing', duration: '6 Weeks', level: 'Beginner', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop', tags: ['SEO', 'Social Media', 'Analytics'], trending: false },
  { title: 'Cybersecurity', duration: '8 Weeks', level: 'Advanced', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=240&fit=crop', tags: ['Network', 'Ethical Hacking', 'Security'], trending: false },
  { title: 'Cloud Computing', duration: '10 Weeks', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=240&fit=crop', tags: ['AWS', 'Docker', 'DevOps'], trending: true },
];

async function seedUsers() {
  for (const seedUser of SEED_USERS) {
    const existing = await User.findOne({ email: seedUser.email });
    if (existing) {
      console.log(`User skipped (exists): ${seedUser.email}`);
      continue;
    }
    await User.create(seedUser);
    console.log(`User created: ${seedUser.email} (${seedUser.role})`);
  }
}

async function seedInterns() {
  for (const { linkUserEmail, ...internData } of SEED_INTERNS) {
    const existing = await Intern.findOne({ email: internData.email });
    if (existing) {
      console.log(`Intern skipped (exists): ${internData.email}`);
      continue;
    }

    if (linkUserEmail) {
      const linkedUser = await User.findOne({ email: linkUserEmail });
      if (linkedUser) {
        internData.userId = linkedUser._id;
      }
    }

    await Intern.create(internData);
    console.log(`Intern created: ${internData.email}`);
  }
}

async function seedPostings() {
  for (const posting of SEED_POSTINGS) {
    const existing = await InternshipPosting.findOne({ title: posting.title });
    if (existing) {
      console.log(`Posting skipped (exists): ${posting.title}`);
      continue;
    }
    await InternshipPosting.create(posting);
    console.log(`Posting created: ${posting.title}`);
  }
}

async function seedTasks() {
  const alex = await User.findOne({ email: 'alex.mercer@example.com' });
  const admin = await User.findOne({ email: 'superadmin@internhub.io' });
  if (!alex || !admin) return;

  const count = await Task.countDocuments();
  if (count > 0) {
    console.log('Tasks skipped (already seeded)');
    return;
  }

  const now = Date.now();
  await Task.insertMany([
    { title: 'Market Research Q3', description: 'Analyze competitor landscape and prepare summary report for Q3.', priority: 'High', status: 'todo', assigneeId: alex._id, dueDate: new Date(now + 3 * 86400000), attachments: 2, comments: 4, createdBy: admin._id },
    { title: 'Update Design System Docs', description: 'Document component library and usage guidelines.', priority: 'Medium', status: 'todo', assigneeId: alex._id, dueDate: new Date(now + 5 * 86400000), attachments: 1, comments: 0, createdBy: admin._id },
    { title: 'Client Presentation Slides', description: 'Create deck for upcoming client review meeting.', priority: 'High', status: 'in_progress', assigneeId: alex._id, dueDate: new Date(now + 86400000), attachments: 0, comments: 12, createdBy: admin._id },
    { title: 'Organize Shared Drive', description: 'Clean up and structure team shared folders.', priority: 'Low', status: 'review', assigneeId: alex._id, dueDate: new Date(now - 86400000), attachments: 0, comments: 0, createdBy: admin._id },
  ]);
  console.log('Tasks created: 4');
}

async function seed() {
  await connectDatabase();
  await seedUsers();
  await seedInterns();
  await seedPostings();
  await seedTasks();
  await disconnectDatabase();
  console.log('Seed complete.');
}

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
