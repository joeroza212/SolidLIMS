import { createCrudRouter } from './_factory.js';
export default createCrudRouter('roleUser', {
    include: { user: true, role: true },
});
