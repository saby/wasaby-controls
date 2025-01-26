import * as React from 'react';

import { TBorderStyle } from 'Controls/display';
import { correctValue } from 'Controls-demo/gridReact/Dev/Editors/Utils';

type TValue = TBorderStyle | undefined;
interface IProps {
    value: TValue;
    onChange: (value: TValue) => void;
}

export function BorderStyleSelector(props: IProps): React.ReactElement {
    return (
        <select
            value={props.value}
            onChange={(event) => {
                return props.onChange(correctValue<TValue>(event.target.value));
            }}
        >
            <option value={undefined}>default</option>
            <option value={'danger'}>danger</option>
        </select>
    );
}
