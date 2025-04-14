import createHttpError from 'http-errors';

export function validateBody(shchema) {
    return async (req, _res, next) => {
        try {
            await shchema.validateAsync(req.body, { abortEarly: false, });
            next();
        } catch (error) {
            const errors = error.details.map((detail) => detail.message);
            next(new createHttpError.BadRequest(errors));
        }
    };
}
