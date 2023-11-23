import * as React from 'react';

interface ISelectInputProps<T> {
    name: string;
    title: string;
    value: T;
    values: T[];
    onChange: (value: { [p: string]: T }) => void;
}

// Селектор для переключения опций демки
export default function SelectInput<T = string>(props: ISelectInputProps<T>): React.ReactElement {
    return (
        <div className={'controls-padding-xs tw-inline-flex'}>
            <label className={'controls-padding_right-m'} htmlFor={props.name}>
                {props.title || props.name}
            </label>
            <select
                id={props.name}
                value={props.value}
                data-qa={`editor-select-${props.name}`}
                onChange={(event: React.BaseSyntheticEvent) => {
                    props.onChange({ [props.name]: event.target.value });
                }}
            >
                {props.values.map((item, index) => {
                    const key = `${props.name}-value-${index}`;
                    return (
                        <option key={key} selected={item === props.value} value={item}>
                            {item}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
