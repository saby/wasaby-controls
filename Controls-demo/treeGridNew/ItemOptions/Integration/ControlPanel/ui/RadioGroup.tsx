import * as React from 'react';

interface RadioOption {
    value: string | null;
    label: string;
}

interface RadioGroupProps {
    name: string;
    value: string | null;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    options: RadioOption[];
}

export function RadioGroup(props: RadioGroupProps): JSX.Element {
    const { name, value, onChange, options } = props;

    return (
        <div className="radio-group">
            {options.map((option) => (
                <label key={option.label} className="radio-label">
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={onChange}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
}
