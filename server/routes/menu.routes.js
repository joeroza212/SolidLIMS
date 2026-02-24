import { createCrudRouter } from './_factory.js';
export default createCrudRouter('menu', {
    include: { parent: true, children: true },
    defaultOrderBy: { sortOrder: 'asc' },
});
