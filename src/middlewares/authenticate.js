import createHttpError from 'http-errors';
import { sessionCollection } from '../db/models/session.js';
import { userCollection } from '../db/models/user.js';

export async function authenticate(req, res, next) {
    const { authorization } = req.headers;
    if (typeof authorization !== 'string') {
        return next(createHttpError.Unauthorized('Please provide access token'));
    };
    const [bearer, accessToken] = authorization.split(' ', 2);
    if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
        return next(createHttpError.Unauthorized('Please provide access token'));
    }

    const session = await sessionCollection.findOne({ accessToken });

    if (session === null) {
        return next(createHttpError.Unauthorized('Session not found'));
    }

    if (session.accessTokenValidUntil < new Date()) {
        return next(createHttpError.Unauthorized('Access token is expired'));
    }

    const user = await userCollection.findById(session.userId);

    if (user === null) {
        return next(createHttpError.Unauthorized('User not found'));
    }

    req.user = { id: user._id, name: user.name };

    next();
}