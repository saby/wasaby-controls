import * as React from 'react';

interface IProps {
    value: number;
    onChange: (value: number) => void;
}

export function StickyColumnsCountSelector(props: IProps): React.ReactElement {
    return (
        <select
            value={props.value}
            onChange={(event) => {
                return props.onChange(+event.target.value);
            }}
        >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
        </select>
    );
}
