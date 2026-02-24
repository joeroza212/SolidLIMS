/**
 * CRUD Route Factory
 * Generates standard CRUD routes for any Prisma model.
 * Reduces boilerplate — each entity only needs to specify its model name and includes.
 */
import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

/**
 * Creates a standard CRUD router for a Prisma model.
 *
 * @param {string} modelName - Prisma model name (e.g., 'gender', 'role')
 * @param {object} options - Configuration options
 * @param {object} options.include - Prisma include relations
 * @param {object} options.createSchema - Zod schema for create validation
 * @param {object} options.updateSchema - Zod schema for update validation
 * @param {Function} options.beforeCreate - Hook before creating
 * @param {Function} options.beforeUpdate - Hook before updating
 * @param {Function} options.customRoutes - Function to add custom routes (receives router)
 * @param {string} options.searchField - Field to search by (default: 'name')
 * @param {object} options.defaultOrderBy - Default sort order
 * @returns {Router}
 */
export function createCrudRouter(modelName, options = {}) {
    const router = Router();
    const model = prisma[modelName];

    const {
        include = {},
        createSchema,
        updateSchema,
        beforeCreate,
        beforeUpdate,
        customRoutes,
        searchField = 'name',
        defaultOrderBy = { id: 'desc' },
    } = options;

    // Add custom routes first (so they take priority over /:id)
    if (customRoutes) {
        customRoutes(router);
    }

    // GET all (with pagination & search)
    router.get('/', authenticate, async (req, res, next) => {
        try {
            const { page = 1, limit = 50, search, active, ...filters } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);

            const where = {};
            if (search && searchField) {
                where[searchField] = { contains: search, mode: 'insensitive' };
            }
            if (active !== undefined) {
                where.isActive = active === 'true';
            }
            // Generic FK filters: any query param ending with "Id" (e.g. roleId=5)
            for (const [key, val] of Object.entries(filters)) {
                if (key.endsWith('Id') && val) {
                    where[key] = parseInt(val);
                }
            }

            const [data, total] = await Promise.all([
                model.findMany({
                    where,
                    include,
                    skip,
                    take: parseInt(limit),
                    orderBy: defaultOrderBy,
                }),
                model.count({ where }),
            ]);

            res.json({
                success: true,
                data,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit)),
                },
            });
        } catch (error) {
            next(error);
        }
    });

    // GET one by id
    router.get('/:id', authenticate, async (req, res, next) => {
        try {
            const item = await model.findUnique({
                where: { id: parseInt(req.params.id) },
                include,
            });

            if (!item) {
                return res.status(404).json({ success: false, message: 'Not found' });
            }

            res.json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    });

    // POST create
    const createMiddleware = createSchema
        ? [authenticate, validate(createSchema)]
        : [authenticate];

    router.post('/', ...createMiddleware, async (req, res, next) => {
        try {
            let data = { ...req.body };
            if (beforeCreate) {
                data = await beforeCreate(data, req);
            }
            const item = await model.create({ data, include });
            res.status(201).json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    });

    // PUT update
    const updateMiddleware = updateSchema
        ? [authenticate, validate(updateSchema)]
        : [authenticate];

    router.put('/:id', ...updateMiddleware, async (req, res, next) => {
        try {
            let data = { ...req.body };
            if (beforeUpdate) {
                data = await beforeUpdate(data, req);
            }
            const item = await model.update({
                where: { id: parseInt(req.params.id) },
                data,
                include,
            });
            res.json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    });

    // DELETE
    router.delete('/:id', authenticate, async (req, res, next) => {
        try {
            await model.delete({
                where: { id: parseInt(req.params.id) },
            });
            res.json({ success: true, message: 'Deleted successfully' });
        } catch (error) {
            next(error);
        }
    });

    return router;
}
