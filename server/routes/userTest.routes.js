import { createCrudRouter } from './_factory.js';
export default createCrudRouter('userTest', {
    include: { patient: { include: { gender: true, prefix: true } }, testCategory: true },
    searchField: 'result',
});
