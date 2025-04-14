import crypto from 'node:crypto';

import bcrypt from 'bcrypt';

import createHttpError from 'http-errors';
import { userCollection } from '../db/models/user.js';
import { sessionCollection } from '../db/models/session.js';

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
        userId: currentSession._id,
        accessToken: crypto.randomBytes(32).toString('base64'),
        refreshToken: crypto.randomBytes(32).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
};
