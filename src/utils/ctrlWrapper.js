export function ctrlWrapper(controllers) {
    return async (req, res, next) => {
        try { await controllers(req, res, next); }
        catch (error) {
            next(error);
        }
    };
}