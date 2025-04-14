import * as fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import handlebars from 'handlebars';

import { userCollection } from '../db/models/user.js';
import { sessionCollection } from '../db/models/session.js';

import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
    path.resolve('src/templates/reset-password.hbs'),
    { encoding: 'UTF-8' },
);

export async function registerUser(playload) {
    const user = await userCollection.findOne({ email: playload.email });
    if (user !== null) {
        throw new createHttpError.Conflict('Email in use');
    }
    playload.password = await bcrypt.hash(playload.password, 10);
    return userCollection.create(playload);
}

export async function loginUser(email, password) {
    const user = await userCollection.findOne({ email });
    if (user === null) {
        throw new createHttpError.Unauthorized('Email or password is incorrect');
    };
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch !== true) {
        throw new createHttpError.Unauthorized('Email or password is incorrect');
    };
    await sessionCollection.deleteOne({ userId: user._id });
    return sessionCollection.create({
        userId: user._id,
        accessToken: crypto.randomBytes(32).toString('base64'),
        refreshToken: crypto.randomBytes(32).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
};

export async function logoutUser(sessionId, refreshToken) {
    await sessionCollection.deleteOne({
        _id: sessionId, refreshToken,
    });
    return undefined;
};

export async function refreshSession(sessionId, refreshToken) {
    const currentSession = await sessionCollection.findOne({
        _id: sessionId,
        refreshToken,
    });
    if (currentSession === null) {
        throw new createHttpError.Unauthorized('Session not found');
    };
    if (currentSession.refreshTokenValidUntil < new Date()) {
        throw new createHttpError.Unauthorized('Refresh token is expired');
    };
    await sessionCollection.deleteOne({
        _id: currentSession._id,
        refreshToken: currentSession.refreshToken,
    });
    return sessionCollection.create({
        userId: currentSession.userId,
        accessToken: crypto.randomBytes(32).toString('base64'),
        refreshToken: crypto.randomBytes(32).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
};

export async function requestResetPassword(email) {
    const user = await userCollection.findOne({ email });
    if (user === null) {
        throw new createHttpError.NotFound('User not found!');
    }
    const resetToken = jwt.sign({ sub: user._id, name: user.name }, getEnvVar('JWT_SECRET'), {
        expiresIn: '5m',
    },
    );
    const template = handlebars.compile(RESET_PASSWORD_TEMPLATE);

    try {
        await sendEmail(email, 'Reset your password', template({ resetToken }));
    }
    catch {
        throw new createHttpError(500, 'Failed to send the email, please try again later.');
    }
};

export async function resetPassword(token, newPassword) {
    try {
        const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

        const user = await userCollection.findById(decoded.sub);

        if (user === null) {
            throw createHttpError.NotFound('User not found');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userCollection.findByIdAndUpdate(user._id, { password: hashedPassword });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw createHttpError.Unauthorized('Token is expired or invalid.');
        }

        if (error.name === 'TokenExpiredError') {
            throw createHttpError.Unauthorized('Token is expired or invalid.');
        }

        throw error;
    }
}