import { createCrudRouter } from './_factory.js';
export default createCrudRouter('transaction', {
    include: { ledgerAccount: { include: { accountType: true } } },
    searchField: 'description',
    defaultOrderBy: { transactionDate: 'desc' },
});
