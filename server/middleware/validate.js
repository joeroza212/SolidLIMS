export function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors?.map(e => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
        }
    };
}
