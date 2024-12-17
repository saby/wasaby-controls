import * as React from 'react';

import type { TBackgroundStyle } from 'Controls/interface';
import { correctValue } from 'Controls-demo/gridReact/Dev/Editors/Utils';

type TValue = TBackgroundStyle | undefined;
interface IProps {
    value: TValue;
    onChange: (value: TValue) => void;
}

export function ColorStyleSelector(props: IProps): React.ReactElement {
    return (
        <select
            value={props.value}
            onChange={(event) => {
                return props.onChange(correctValue<TValue>(event.target.value));
            }}
        >
            <option value={undefined}>default</option>
            <option value={'danger'}>danger</option>
            <option value={'success'}>success</option>
            <option value={'warning'}>warning</option>
            <option value={'primary'}>primary</option>
            <option value={'secondary'}>secondary</option>
            <option value={'unaccented'}>unaccented</option>
            <option value={'readonly'}>readonly</option>
            <option value={'info'}>info</option>
        </select>
    );
}
