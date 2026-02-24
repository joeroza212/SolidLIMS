import { createCrudRouter } from './_factory.js';
export default createCrudRouter('notification', { searchField: 'title', defaultOrderBy: { dateAdded: 'desc' } });
