// Entity field definitions for CRUD forms
// Each entity maps to an array of field configs
// type: 'text' | 'number' | 'email' | 'password' | 'date' | 'boolean' | 'lookup'
// lookup fields have: lookupEntity (API entity name), lookupDisplay (field to show in dropdown)

const entityFields = {
    // ─── Patients (filtered view of users) ────
    patients: {
        _meta: {
            listUrl: '/users/patients/list',   // custom list endpoint
            crudEntity: 'users',               // create/update via /users
            hiddenDefaults: { canLogin: false, roleId: 5 }, // auto-set on create (Patient role = 5)
        },
        fields: [
            { name: 'userName', label: 'Patient Name', type: 'text', required: true },
            { name: 'contactNumber', label: 'Contact Number', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'address', label: 'Address', type: 'text' },
            { name: 'age', label: 'Age', type: 'number' },
            { name: 'dated', label: 'Date', type: 'date' },
            { name: 'genderId', label: 'Gender', type: 'lookup', lookupEntity: 'genders', lookupDisplay: 'name', required: true },
            { name: 'prefixId', label: 'Prefix', type: 'lookup', lookupEntity: 'gender-prefixes', lookupDisplay: 'name' },
            { name: 'givenMethodId', label: 'Given Method', type: 'lookup', lookupEntity: 'given-methods', lookupDisplay: 'name' },
            { name: 'referredByDoctorUserId', label: 'Referred By Doctor', type: 'lookup', lookupEntity: 'users', lookupDisplay: 'userName' },
            { name: 'isActive', label: 'Is Active', type: 'boolean' },
            { name: 'isReportGiven', label: 'Report Given', type: 'boolean' },
            { name: 'reportGivenDate', label: 'Report Given Date', type: 'date' },
            { name: 'collectionDate', label: 'Collection Date', type: 'date' },
        ],
    },
    // ─── User & Access ────────────────────────
    users: {
        _meta: {
            filters: [
                { name: 'roleId', label: 'Filter by Role', lookupEntity: 'roles', lookupDisplay: 'name' },
            ],
        },
        fields: [
            { name: 'userName', label: 'Username', type: 'text', required: true },
            { name: 'password', label: 'Password', type: 'password' },
            { name: 'roleId', label: 'Role', type: 'lookup', lookupEntity: 'roles', lookupDisplay: 'name', required: true },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'contactNumber', label: 'Contact Number', type: 'text' },
            { name: 'age', label: 'Age', type: 'number' },
            { name: 'genderId', label: 'Gender', type: 'lookup', lookupEntity: 'genders', lookupDisplay: 'name', required: true },
            { name: 'canLogin', label: 'Can Login', type: 'boolean' },
            { name: 'isActive', label: 'Is Active', type: 'boolean' },
            { name: 'address', label: 'Address', type: 'text' },
            { name: 'dated', label: 'Date', type: 'date' },
            { name: 'prefixId', label: 'Prefix', type: 'lookup', lookupEntity: 'gender-prefixes', lookupDisplay: 'name' },
            { name: 'givenMethodId', label: 'Given Method', type: 'lookup', lookupEntity: 'given-methods', lookupDisplay: 'name' },
            { name: 'referredByDoctorUserId', label: 'Referred By Doctor', type: 'lookup', lookupEntity: 'users', lookupDisplay: 'userName' },
            { name: 'isReportGiven', label: 'Report Given', type: 'boolean' },
            { name: 'reportGivenDate', label: 'Report Given Date', type: 'date' },
            { name: 'collectionDate', label: 'Collection Date', type: 'date' },
        ],
    },
    roles: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'role-users': [
        { name: 'userId', label: 'User', type: 'lookup', lookupEntity: 'users', lookupDisplay: 'userName', required: true },
        { name: 'roleId', label: 'Role', type: 'lookup', lookupEntity: 'roles', lookupDisplay: 'name', required: true },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    menus: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'url', label: 'URL', type: 'text' },
        { name: 'icon', label: 'Icon', type: 'text' },
        { name: 'parentId', label: 'Parent Menu', type: 'lookup', lookupEntity: 'menus', lookupDisplay: 'name' },
        { name: 'sortOrder', label: 'Sort Order', type: 'number' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'menu-permissions': [
        { name: 'userId', label: 'User', type: 'lookup', lookupEntity: 'users', lookupDisplay: 'userName', required: true },
        { name: 'menuId', label: 'Menu', type: 'lookup', lookupEntity: 'menus', lookupDisplay: 'name', required: true },
        { name: 'canView', label: 'Can View', type: 'boolean' },
        { name: 'canInsert', label: 'Can Insert', type: 'boolean' },
        { name: 'canUpdate', label: 'Can Update', type: 'boolean' },
        { name: 'canDelete', label: 'Can Delete', type: 'boolean' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],

    // ─── Lab ──────────────────────────────────
    'test-categories': [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'shortName', label: 'Short Name', type: 'text' },
        { name: 'price', label: 'Price', type: 'number' },
        { name: 'normalValue', label: 'Normal Value', type: 'text' },
        { name: 'unit', label: 'Unit', type: 'text' },
        { name: 'parentId', label: 'Parent Category', type: 'lookup', lookupEntity: 'test-categories', lookupDisplay: 'name' },
        { name: 'sortOrder', label: 'Sort Order', type: 'number' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
        { name: 'isMachine', label: 'Is Machine', type: 'boolean' },
        { name: 'isHeader', label: 'Is Header', type: 'boolean' },
    ],
    'user-tests': [
        { name: 'patientUserId', label: 'Patient', type: 'lookup', lookupEntity: 'users', lookupDisplay: 'userName', required: true },
        { name: 'testCategoryId', label: 'Test Category', type: 'lookup', lookupEntity: 'test-categories', lookupDisplay: 'name', required: true },
        { name: 'result', label: 'Result', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'widal-tests': [
        { name: 'patientUserId', label: 'Patient', type: 'lookup', lookupEntity: 'users', lookupDisplay: 'userName', required: true },
        { name: 'sTyphi_O', label: 'S. Typhi O', type: 'text' },
        { name: 'sTyphi_H', label: 'S. Typhi H', type: 'text' },
        { name: 'sParaTyphi_AO', label: 'S. Para Typhi AO', type: 'text' },
        { name: 'sParaTyphi_AH', label: 'S. Para Typhi AH', type: 'text' },
        { name: 'sParaTyphi_BO', label: 'S. Para Typhi BO', type: 'text' },
        { name: 'sParaTyphi_BH', label: 'S. Para Typhi BH', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],

    // ─── Patient ──────────────────────────────
    'permanent-patients': [
        { name: 'patientUserId', label: 'Patient', type: 'lookup', lookupEntity: 'users', lookupDisplay: 'userName', required: true },
        { name: 'discount', label: 'Discount', type: 'number' },
        { name: 'remarks', label: 'Remarks', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'patient-amounts': [
        { name: 'userId', label: 'User', type: 'lookup', lookupEntity: 'users', lookupDisplay: 'userName', required: true },
        { name: 'totalAmount', label: 'Total Amount', type: 'number' },
        { name: 'paidAmount', label: 'Paid Amount', type: 'number' },
        { name: 'discount', label: 'Discount', type: 'number' },
        { name: 'dueAmount', label: 'Due Amount', type: 'number' },
        { name: 'remarks', label: 'Remarks', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'patient-histories': [
        { name: 'userId', label: 'User', type: 'lookup', lookupEntity: 'users', lookupDisplay: 'userName', required: true },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],

    // ─── Finance ──────────────────────────────
    'account-types': [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'ledger-accounts': [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'accountTypeId', label: 'Account Type', type: 'lookup', lookupEntity: 'account-types', lookupDisplay: 'name', required: true },
        { name: 'openingBalance', label: 'Opening Balance', type: 'number' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    transactions: [
        { name: 'ledgerAccountId', label: 'Ledger Account', type: 'lookup', lookupEntity: 'ledger-accounts', lookupDisplay: 'name', required: true },
        { name: 'debit', label: 'Debit', type: 'number' },
        { name: 'credit', label: 'Credit', type: 'number' },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'transactionDate', label: 'Transaction Date', type: 'date' },
        { name: 'voucherNo', label: 'Voucher No', type: 'text' },
        { name: 'referenceNo', label: 'Reference No', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'payment-methods': [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],

    // ─── Inventory ────────────────────────────
    products: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'unit', label: 'Unit', type: 'text' },
        { name: 'minStock', label: 'Min Stock', type: 'number' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    vendors: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    stocks: [
        { name: 'productId', label: 'Product', type: 'lookup', lookupEntity: 'products', lookupDisplay: 'name', required: true },
        { name: 'vendorId', label: 'Vendor', type: 'lookup', lookupEntity: 'vendors', lookupDisplay: 'name' },
        { name: 'quantity', label: 'Quantity', type: 'number' },
        { name: 'unitPrice', label: 'Unit Price', type: 'number' },
        { name: 'totalPrice', label: 'Total Price', type: 'number', readOnly: true, computed: (data) => (parseFloat(data.quantity) || 0) * (parseFloat(data.unitPrice) || 0) },
        { name: 'batchNo', label: 'Batch No', type: 'text' },
        { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
        { name: 'remarks', label: 'Remarks', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'stock-in-outs': [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],

    // ─── System ───────────────────────────────
    genders: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'gender-prefixes': [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'given-methods': [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    statuses: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'app-settings': [
        { name: 'appName', label: 'App Name', type: 'text' },
        { name: 'appShortName', label: 'Short Name', type: 'text' },
        { name: 'appVersion', label: 'Version', type: 'text' },
        { name: 'footerText', label: 'Footer Text', type: 'text' },
        { name: 'skin', label: 'Skin', type: 'text' },
        { name: 'logo', label: 'Logo', type: 'file' },
        { name: 'isToggleSidebar', label: 'Toggle Sidebar', type: 'boolean' },
        { name: 'isToggleRightSidebar', label: 'Toggle Right Sidebar', type: 'boolean' },
        { name: 'isFixedLayout', label: 'Fixed Layout', type: 'boolean' },
        { name: 'isBoxedLayout', label: 'Boxed Layout', type: 'boolean' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'general-settings': [
        { name: 'settingKey', label: 'Setting Key', type: 'text', required: true },
        { name: 'settingValue', label: 'Setting Value', type: 'text' },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    notifications: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'message', label: 'Message', type: 'text' },
        { name: 'url', label: 'URL', type: 'text' },
        { name: 'icon', label: 'Icon', type: 'text' },
        { name: 'isRead', label: 'Is Read', type: 'boolean' },
        { name: 'userId', label: 'User', type: 'lookup', lookupEntity: 'users', lookupDisplay: 'userName' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    'report-formats': [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'headerLeft', label: 'Header Left', type: 'text' },
        { name: 'headerCenter', label: 'Header Center', type: 'text' },
        { name: 'headerRight', label: 'Header Right', type: 'text' },
        { name: 'footerLeft', label: 'Footer Left', type: 'text' },
        { name: 'footerCenter', label: 'Footer Center', type: 'text' },
        { name: 'footerRight', label: 'Footer Right', type: 'text' },
        { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
};

export default entityFields;
