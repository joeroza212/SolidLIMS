import { createCrudRouter } from './_factory.js';
export default createCrudRouter('menuPermission', {
    include: { user: true, menu: true },
});
