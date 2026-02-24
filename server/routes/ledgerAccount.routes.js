import { createCrudRouter } from './_factory.js';
export default createCrudRouter('ledgerAccount', {
    include: { accountType: true },
});
