import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
    console.log('🌱 Seeding database...\n');

    // ─── Genders ──────────────────────────────
    const male = await prisma.gender.upsert({
        where: { id: 1 },
        update: {},
        create: { name: 'Male' },
    });
    const female = await prisma.gender.upsert({
        where: { id: 2 },
        update: {},
        create: { name: 'Female' },
    });
    const other = await prisma.gender.upsert({
        where: { id: 3 },
        update: {},
        create: { name: 'Other' },
    });
    console.log('✅ Genders seeded:', [male, female, other].map(g => g.name).join(', '));

    // ─── Gender Prefixes ──────────────────────
    const prefixes = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Master', 'Miss'];
    for (let i = 0; i < prefixes.length; i++) {
        await prisma.genderPrefix.upsert({
            where: { id: i + 1 },
            update: {},
            create: { name: prefixes[i] },
        });
    }
    console.log('✅ Gender Prefixes seeded:', prefixes.join(', '));

    // ─── Roles ────────────────────────────────
    const adminRole = await prisma.role.upsert({
        where: { id: 1 },
        update: {},
        create: { name: 'Admin', description: 'System Administrator' },
    });
    const doctorRole = await prisma.role.upsert({
        where: { id: 2 },
        update: {},
        create: { name: 'Doctor', description: 'Doctor' },
    });
    const technicianRole = await prisma.role.upsert({
        where: { id: 3 },
        update: {},
        create: { name: 'Technician', description: 'Lab Technician' },
    });
    const receptionistRole = await prisma.role.upsert({
        where: { id: 4 },
        update: {},
        create: { name: 'Receptionist', description: 'Receptionist' },
    });
    const patientRole = await prisma.role.upsert({
        where: { id: 5 },
        update: {},
        create: { name: 'Patient', description: 'Patient' },
    });
    console.log('✅ Roles seeded:', [adminRole, doctorRole, technicianRole, receptionistRole, patientRole].map(r => r.name).join(', '));

    // ─── Given Methods ────────────────────────
    const methods = ['Walk-in', 'Referral', 'Online', 'Emergency'];
    for (let i = 0; i < methods.length; i++) {
        await prisma.givenMethod.upsert({
            where: { id: i + 1 },
            update: {},
            create: { name: methods[i] },
        });
    }
    console.log('✅ Given Methods seeded:', methods.join(', '));

    // ─── Statuses ──────────────────────────────
    const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
    for (let i = 0; i < statuses.length; i++) {
        await prisma.status.upsert({
            where: { id: i + 1 },
            update: {},
            create: { name: statuses[i] },
        });
    }
    console.log('✅ Statuses seeded:', statuses.join(', '));

    // ─── Payment Methods ──────────────────────
    const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Insurance'];
    for (let i = 0; i < paymentMethods.length; i++) {
        await prisma.paymentMethod.upsert({
            where: { id: i + 1 },
            update: {},
            create: { name: paymentMethods[i] },
        });
    }
    console.log('✅ Payment Methods seeded:', paymentMethods.join(', '));

    // ─── Account Types ────────────────────────
    const accountTypes = ['Asset', 'Liability', 'Income', 'Expense'];
    for (let i = 0; i < accountTypes.length; i++) {
        await prisma.accountType.upsert({
            where: { id: i + 1 },
            update: {},
            create: { name: accountTypes[i] },
        });
    }
    console.log('✅ Account Types seeded:', accountTypes.join(', '));

    // ─── Admin User ───────────────────────────
    const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
    const adminUser = await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            userName: 'admin',
            password: hashedPassword,
            email: 'admin@solidlims.com',
            contactNumber: '0000000000',
            address: 'System',
            age: 30,
            canLogin: true,
            isActive: true,
            isReportGiven: false,
            genderId: male.id,
            roleId: adminRole.id,
            dateAdded: new Date(),
        },
    });
    console.log('✅ Admin user seeded:', adminUser.userName, '(password: admin123)');

    // ─── App Settings ─────────────────────────
    await prisma.appSetting.upsert({
        where: { id: 1 },
        update: {},
        create: {
            appName: 'SolidLIMS',
            appShortName: 'SLIMS',
            appVersion: '1.0.0',
            footerText: '© 2026 SolidLIMS. All rights reserved.',
            skin: 'default',
            isActive: true,
        },
    });
    console.log('✅ App Settings seeded');

    // ─── Menus ────────────────────────────────
    const menuGroups = [
        { name: 'Dashboard', url: '/dashboard', icon: 'fa fa-dashboard', sortOrder: 1 },
        { name: 'Lab', url: null, icon: 'fa fa-flask', sortOrder: 2 },
        { name: 'Patient', url: null, icon: 'fa fa-user', sortOrder: 3 },
        { name: 'Finance', url: null, icon: 'fa fa-money', sortOrder: 4 },
        { name: 'Inventory', url: null, icon: 'fa fa-cubes', sortOrder: 5 },
        { name: 'System', url: null, icon: 'fa fa-cog', sortOrder: 6 },
        { name: 'Users & Access', url: null, icon: 'fa fa-users', sortOrder: 7 },
    ];
    for (let i = 0; i < menuGroups.length; i++) {
        await prisma.menu.upsert({
            where: { id: i + 1 },
            update: {},
            create: menuGroups[i],
        });
    }
    console.log('✅ Menus seeded:', menuGroups.map(m => m.name).join(', '));

    console.log('\n🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
