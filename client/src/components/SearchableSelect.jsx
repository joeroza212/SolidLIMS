import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createCrudApi } from '../api/index.js';

export default function SearchableSelect({ entity, value, onChange, displayField = 'name', placeholder, required }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);
    const api = createCrudApi(entity);

    // Fetch options with search
    const { data, isLoading } = useQuery({
        queryKey: [entity, 'lookup', search],
        queryFn: () => api.getAll({ limit: 50, search: search || undefined }),
        staleTime: 30000,
    });

    const options = data?.data || [];

    // Find selected item label
    const selectedItem = options.find(o => o.id === value);
    const displayValue = selectedItem ? (selectedItem[displayField] || `#${selectedItem.id}`) : '';

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (item) => {
        onChange(item.id);
        setSearch('');
        setOpen(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        setSearch('');
    };

    return (
        <div className="searchable-select" ref={ref}>
            <div
                className={`searchable-select__control ${open ? 'is-open' : ''}`}
                onClick={() => setOpen(!open)}
            >
                {open ? (
                    <input
                        className="searchable-select__search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search ${placeholder || entity}...`}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className={`searchable-select__value ${!displayValue ? 'is-placeholder' : ''}`}>
                        {displayValue || placeholder || `Select ${entity}...`}
                    </span>
                )}
                <div className="searchable-select__indicators">
                    {value && (
                        <button type="button" className="searchable-select__clear" onClick={handleClear} title="Clear">
                            ×
                        </button>
                    )}
                    <span className="searchable-select__arrow">{open ? '▲' : '▼'}</span>
                </div>
            </div>

            {open && (
                <div className="searchable-select__menu">
                    {isLoading ? (
                        <div className="searchable-select__option is-loading">Loading...</div>
                    ) : options.length === 0 ? (
                        <div className="searchable-select__option is-empty">No results found</div>
                    ) : (
                        options.map(item => (
                            <div
                                key={item.id}
                                className={`searchable-select__option ${item.id === value ? 'is-selected' : ''}`}
                                onClick={() => handleSelect(item)}
                            >
                                <span className="searchable-select__option-id">#{item.id}</span>
                                <span>{item[displayField] || item.userName || `Item #${item.id}`}</span>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Hidden input for form validation */}
            {required && <input type="text" value={value || ''} required style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }} tabIndex={-1} />}
        </div>
    );
}
