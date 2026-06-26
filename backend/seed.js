require('dotenv').config();
const { connectDB } = require('./src/config/database');
const { User } = require('./src/models');

const testUsers = [
  { name: 'Legacy Admin', email: 'admin@tms.com', password: 'Admin@1234', role: 'Admin' },
  { name: 'System Admin', email: 'tasknova.test26@gmail.com', password: 'Admin@1234', role: 'Admin' },
  { name: 'Test Manager', email: 'manager@tms.com', password: 'Manager@1234', role: 'Project Manager' },
  { name: 'Test Collaborator', email: 'collab@tms.com', password: 'Collab@1234', role: 'Collaborator' },
  { name: 'Test Collaborator Legacy', email: 'collaborator@tms.com', password: 'Collab@1234', role: 'Collaborator' },
];

const seed = async () => {
  console.log('\nStarting database seed...\n');
  await connectDB();

  for (const u of testUsers) {
    const existing = await User.findOne({ where: { email: u.email } });

    if (existing) {
      await existing.update({
        name: u.name,
        password: u.password,
        role: u.role,
        isActive: true,
        mustResetPassword: false,
      });

      console.log(`Updated ${u.role}`);
      console.log(`   Email:    ${u.email}`);
      console.log(`   Password: ${u.password}`);
      continue;
    }

    await User.create({
      name: u.name,
      email: u.email,
      password: u.password,
      role: u.role,
      mustResetPassword: false,
    });

    console.log(`Created ${u.role}`);
    console.log(`   Email:    ${u.email}`);
    console.log(`   Password: ${u.password}`);
  }

  console.log('\nThese are DEV-only accounts; remove before production.\n');
  console.log('Note: 2FA codes are printed in the backend console during development.\n');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
