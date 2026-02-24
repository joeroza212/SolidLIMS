import { createCrudRouter } from './_factory.js';
export default createCrudRouter('testCategory', {
    include: { parent: true, children: true },
    defaultOrderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
});
