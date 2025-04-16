import * as React from 'react';

interface SelectOption {
    value: string | null;
    label: string;
}

interface SelectProps {
    value: string | null;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    label?: string;
    'data-qa': string;
}

export function Select(props: SelectProps): JSX.Element {
    const { value, onChange, options, label, 'data-qa': dataQa } = props;

    return (
        <div className="select-container" data-qa={`${dataQa}Container`}>
            {label && (
                <label className="select-label" data-qa={`${dataQa}Label`}>
                    {label}
                </label>
            )}
            <select
                className="select-control"
                value={value || ''}
                onChange={onChange}
                data-qa={dataQa}
            >
                {options.map((option) => (
                    <option
                        key={option.value || 'null'}
                        value={option.value || ''}
                        data-qa={`${dataQa}Option${option.label.replace(/\s+/g, '')}`}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
