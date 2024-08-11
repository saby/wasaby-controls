import * as React from 'react';

import { TVerticalAlign } from 'Controls/interface';
import { correctValue } from 'Controls-demo/gridReact/Dev/Editors/Utils';

type TValue = TVerticalAlign | undefined;
interface IProps {
    value: TValue;
    onChange: (value: TValue) => void;
}

export function VAlignSelector(props: IProps): React.ReactElement {
    return (
        <select
            value={props.value}
            onChange={(event) => {
                return props.onChange(correctValue<TValue>(event.target.value));
            }}
        >
            <option value={undefined}>default</option>
            <option value={'start'}>start</option>
            <option value={'center'}>center</option>
            <option value={'end'}>end</option>
            <option value={'baseline'}>baseline</option>
        </select>
    );
}
