import * as React from 'react';

import { TVisibility } from 'Controls/interface';
import { correctValue } from 'Controls-demo/gridReact/Dev/Editors/Utils';

type TValue = TVisibility | undefined;
interface IProps {
    value: TValue;
    onChange: (value: TValue) => void;
}

export function VisibilitySelector(props: IProps): React.ReactElement {
    return (
        <select
            value={props.value}
            onChange={(event) => {
                return props.onChange(correctValue<TValue>(event.target.value));
            }}
        >
            <option value={undefined}>default</option>
            <option value={'hidden'}>hidden</option>
            <option value={'visible'}>visible</option>
            <option value={'onhover'}>onhover</option>
        </select>
    );
}
