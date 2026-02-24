import { createCrudRouter } from './_factory.js';
export default createCrudRouter('permanentPatient', {
    include: { patient: { include: { gender: true, prefix: true } } },
});
