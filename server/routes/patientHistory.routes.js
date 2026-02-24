import { createCrudRouter } from './_factory.js';
export default createCrudRouter('patientHistory', {
    include: { user: { include: { gender: true, prefix: true } } },
    searchField: 'description',
    defaultOrderBy: { dateAdded: 'desc' },
});
