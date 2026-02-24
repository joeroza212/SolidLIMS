import { createCrudRouter } from './_factory.js';
export default createCrudRouter('patientAmount', {
    include: { user: { include: { gender: true, prefix: true } } },
});
