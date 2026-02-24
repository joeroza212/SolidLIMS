import { createCrudRouter } from './_factory.js';
export default createCrudRouter('widalTest', {
    include: { patient: { include: { gender: true, prefix: true } } },
});
