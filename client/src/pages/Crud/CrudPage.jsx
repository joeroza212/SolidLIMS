import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiInstance, { createCrudApi } from '../../api/index.js';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import entityFields from '../../config/entityFields.js';
import SearchableSelect from '../../components/SearchableSelect.jsx';
import FileUpload from '../../components/FileUpload.jsx';

export default function CrudPage({ entity, title }) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // Resolve entity config — supports _meta for custom list/CRUD mappings
    const entityConfig = entityFields[entity];
    const hasMeta = entityConfig && entityConfig._meta;
    const meta = hasMeta ? entityConfig._meta : {};
    const fields = hasMeta ? entityConfig.fields : (entityConfig || []);
    const crudEntity = meta.crudEntity || entity;
    const listUrl = meta.listUrl || null;

    const api = createCrudApi(crudEntity);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [activeFilters, setActiveFilters] = useState({});

    const metaFilters = meta.filters || [];

    // Table columns: show up to 8 non-password fields
    const tableColumns = fields.filter(f => f.type !== 'password').slice(0, 8);

    const { data, isLoading } = useQuery({
        queryKey: [entity, page, search, activeFilters],
        queryFn: () => {
            const params = { page, limit: 20, search: search || undefined, ...activeFilters };
            return listUrl
                ? apiInstance.get(listUrl, { params }).then(r => r.data)
                : api.getAll(params);
        },
    });

    const createMutation = useMutation({
        mutationFn: (d) => api.create(d),
        onSuccess: () => { queryClient.invalidateQueries([entity]); setShowModal(false); toast.success('Created!'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Error'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, ...d }) => api.update(id, d),
        onSuccess: () => { queryClient.invalidateQueries([entity]); setShowModal(false); toast.success('Updated!'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Error'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(id),
        onSuccess: () => { queryClient.invalidateQueries([entity]); toast.success('Deleted!'); },
        onError: (e) => toast.error(e.response?.data?.message || 'Error'),
    });

    const items = data?.data || [];
    const pagination = data?.pagination || {};

    const openCreate = () => {
        setEditItem(null);
        // Initialize form with default values
        const defaults = {};
        fields.forEach(f => {
            if (f.type === 'boolean') defaults[f.name] = true;
            else defaults[f.name] = '';
        });
        setFormData(defaults);
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        const clean = {};
        fields.forEach(f => {
            if (f.type === 'password') return; // skip password on edit
            if (f.type === 'date' && item[f.name]) {
                clean[f.name] = item[f.name].slice(0, 10); // format YYYY-MM-DD
            } else {
                clean[f.name] = item[f.name] ?? '';
            }
        });
        setFormData(clean);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Clean up data before submit
        const submitData = {};
        fields.forEach(f => {
            const val = formData[f.name];
            if (val === '' || val === undefined || val === null) {
                if (f.required) submitData[f.name] = val; // let server validate
                return; // skip empty optional fields
            }
            if (f.type === 'number') {
                submitData[f.name] = parseFloat(val) || 0;
            } else if (f.type === 'boolean') {
                submitData[f.name] = val === true || val === 'true';
            } else if (f.type === 'date') {
                // Convert YYYY-MM-DD to full ISO-8601 DateTime for Prisma
                submitData[f.name] = new Date(val).toISOString();
            } else {
                submitData[f.name] = val;
            }
        });

        if (editItem) {
            updateMutation.mutate({ id: editItem.id, ...submitData });
        } else {
            // Apply hidden defaults for entities with _meta (e.g., patients)
            const createData = meta.hiddenDefaults
                ? { ...meta.hiddenDefaults, ...submitData }
                : submitData;
            createMutation.mutate(createData);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm(t('common.confirmDelete'))) {
            deleteMutation.mutate(id);
        }
    };

    const formatCell = (value, field, item) => {
        // For lookup fields, resolve the relation object
        if (field && field.type === 'lookup' && item) {
            // e.g. field.name = 'productId' → relationKey = 'product'
            const relationKey = field.name.replace(/Id$/, '');
            const related = item[relationKey];
            const id = item[field.name];
            if (related && typeof related === 'object') {
                const displayVal = related[field.lookupDisplay] || related.userName || related.name || '';
                return displayVal;
            }
            return id != null ? String(id) : '—';
        }
        if (value === null || value === undefined) return '—';
        // For file fields, show image preview thumbnail
        if (field && field.type === 'file' && value) {
            const src = value.startsWith('http') ? value : `${window.location.protocol}//${window.location.hostname}:3000${value}`;
            return <img src={src} alt="logo" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }} />;
        }
        if (typeof value === 'boolean') return value ? '✅' : '❌';
        if (typeof value === 'object') return JSON.stringify(value);
        if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
            return new Date(value).toLocaleDateString('id-ID');
        }
        if (typeof value === 'number' || (typeof value === 'string' && !isNaN(value) && value !== '' && field?.type === 'number')) {
            return Number(value).toLocaleString('id-ID', { maximumFractionDigits: 0 });
        }
        return String(value);
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => {
            const updated = { ...prev, [field.name]: value };
            // Recalculate computed fields
            fields.forEach(f => {
                if (f.computed) {
                    updated[f.name] = f.computed(updated);
                }
            });
            return updated;
        });
    };

    // Get form fields (exclude password on edit)
    const formFields = editItem
        ? fields.filter(f => f.type !== 'password')
        : fields;

    return (
        <div className="crud-page">
            <div className="page-header">
                <h1>{title}</h1>
                <button className="btn btn-primary" onClick={openCreate}>
                    <FaPlus /> {t('common.add')}
                </button>
            </div>

            <div className="toolbar">
                <div className="toolbar-row">
                    <div className="search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    {metaFilters.map(filter => (
                        <div key={filter.name} className="filter-box">
                            <SearchableSelect
                                entity={filter.lookupEntity}
                                value={activeFilters[filter.name] || ''}
                                onChange={(val) => {
                                    setActiveFilters(prev => {
                                        const next = { ...prev };
                                        if (val) next[filter.name] = val;
                                        else delete next[filter.name];
                                        return next;
                                    });
                                    setPage(1);
                                }}
                                displayField={filter.lookupDisplay || 'name'}
                                placeholder={filter.label}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="table-container">
                {isLoading ? (
                    <div className="loading">{t('common.loading')}</div>
                ) : items.length === 0 ? (
                    <div className="no-data">{t('common.noData')}</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                {tableColumns.map(col => (
                                    <th key={col.name}>{col.label}</th>
                                ))}
                                <th>{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{(page - 1) * 20 + i + 1}</td>
                                    {tableColumns.map(col => (
                                        <td key={col.name}>{formatCell(item[col.name], col, item)}</td>
                                    ))}
                                    <td className="actions-cell">
                                        <button className="btn-icon btn-edit" onClick={() => openEdit(item)} title={t('common.edit')}>
                                            <FaEdit />
                                        </button>
                                        <button className="btn-icon btn-delete" onClick={() => handleDelete(item.id)} title={t('common.delete')}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span>Page {page} of {pagination.totalPages}</span>
                    <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editItem ? `Edit ${title}` : `Add ${title}`}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-body">
                            {formFields.map(field => (
                                <div key={field.name} className="form-group">
                                    <label>
                                        {field.label}
                                        {field.required && <span className="required">*</span>}
                                    </label>
                                    {field.type === 'boolean' ? (
                                        <select
                                            value={String(formData[field.name] ?? true)}
                                            onChange={(e) => handleFieldChange(field, e.target.value === 'true')}
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    ) : field.type === 'lookup' ? (
                                        <SearchableSelect
                                            entity={field.lookupEntity}
                                            value={formData[field.name] || ''}
                                            onChange={(val) => handleFieldChange(field, val)}
                                            displayField={field.lookupDisplay || 'name'}
                                            placeholder={field.label}
                                            required={field.required}
                                        />
                                    ) : field.type === 'file' ? (
                                        <FileUpload
                                            value={formData[field.name] || ''}
                                            onChange={(url) => handleFieldChange(field, url)}
                                            placeholder={field.label}
                                        />
                                    ) : (
                                        <input
                                            type={field.type === 'number' ? 'number' : field.type}
                                            value={formData[field.name] ?? ''}
                                            onChange={(e) => handleFieldChange(field, e.target.value)}
                                            required={field.required}
                                            readOnly={field.readOnly}
                                            step={field.type === 'number' ? 'any' : undefined}
                                            placeholder={field.label}
                                            className={field.readOnly ? 'input-readonly' : ''}
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
                                <button type="submit" className="btn btn-primary">{t('common.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
