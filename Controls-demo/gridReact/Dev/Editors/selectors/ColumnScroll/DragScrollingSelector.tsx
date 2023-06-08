import * as React from 'react';

interface IProps {
    value: boolean | undefined;
    onChange: (value: boolean | undefined) => void;
}

export function DragScrollingSelector(props: IProps): React.ReactElement {
    return (
        <select
            value={'' + props.value}
            onChange={(event) => {
                return props.onChange(
                    event.target.value === 'undefined'
                        ? undefined
                        : event.target.value === 'true'
                );
            }}
        >
            <option value={'undefined'}>undefined</option>
            <option value={'true'}>true</option>
            <option value={'false'}>false</option>
        </select>
    );
}
