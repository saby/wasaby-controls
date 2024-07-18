import * as React from 'react';
import { correctValue } from 'Controls-demo/gridReact/Dev/Editors/Utils';

type TValue = 'horizontal' | 'vertical' | undefined;
interface IProps {
    value: TValue;
    onChange: (value: TValue) => void;
}

export function OrientationSelector(props: IProps): React.ReactElement {
    return (
        <select
            value={props.value}
            onChange={(event) => {
                return props.onChange(correctValue<TValue>(event.target.value));
            }}
        >
            <option value={undefined}>default</option>
            <option value={'horizontal'}>horizontal</option>
            <option value={'vertical'}>vertical</option>
        </select>
    );
}
