import { createCrudRouter } from './_factory.js';
export default createCrudRouter('stock', {
    include: { product: true, vendor: true },
    searchField: 'batchNo',
});
