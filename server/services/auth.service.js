import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

export async function login(userName, password) {
    const user = await prisma.user.findFirst({
        where: { userName, canLogin: true, isActive: true },
        include: {
            role: true,
            prefix: true,
            gender: true,
        },
    });

    if (!user) {
        throw Object.assign(new Error('Invalid username or password'), { status: 401 });
    }

    const isValid = await comparePassword(password, user.password || '');
    if (!isValid) {
        throw Object.assign(new Error('Invalid username or password'), { status: 401 });
    }

    const tokenPayload = {
        id: user.id,
        userName: user.userName,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role?.name,
    };

    const token = generateToken(tokenPayload);

    // Get app settings for user context
    const appSetting = await prisma.appSetting.findFirst({ where: { isActive: true } });

    return {
        token,
        user: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            contactNumber: user.contactNumber,
            role: user.role,
            prefix: user.prefix,
            gender: user.gender,
        },
        appSetting,
    };
}

export async function register(data) {
    const existing = await prisma.user.findFirst({
        where: { userName: data.userName },
    });
    if (existing) {
        throw Object.assign(new Error('Username already exists'), { status: 409 });
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            canLogin: data.canLogin ?? false,
            isReportGiven: false,
            dateAdded: new Date(),
        },
        include: { role: true, gender: true },
    });

    return user;
}

export async function changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw Object.assign(new Error('User not found'), { status: 404 });
    }

    const isValid = await comparePassword(oldPassword, user.password || '');
    if (!isValid) {
        throw Object.assign(new Error('Current password is incorrect'), { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword, dateModified: new Date() },
    });

    return { message: 'Password changed successfully' };
}
