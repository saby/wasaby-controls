import * as React from 'react';
import { TActionCaptionPosition } from 'Controls/itemActions';
import { correctValue } from 'Controls-demo/gridReact/Dev/Editors/Utils';

type TValue = TActionCaptionPosition | undefined;
interface IProps {
    value: TValue;
    onChange: (value: TValue) => void;
}

export function ActionCaptionPositionSelector(
    props: IProps
): React.ReactElement {
    return (
        <select
            value={props.value}
            onChange={(event) => {
                return props.onChange(correctValue(event.target.value));
            }}
        >
            <option value={undefined}>default</option>
            <option value={'right'}>right</option>
            <option value={'bottom'}>bottom</option>
            <option value={'none'}>none</option>
        </select>
    );
}
