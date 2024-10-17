import * as React from 'react';
import { TItemActionsPosition } from 'Controls/itemActions';
import { correctValue } from 'Controls-demo/gridReact/Dev/Editors/Utils';

type TValue = TItemActionsPosition | undefined;
interface IProps {
    value: TValue;
    onChange: (value: TValue) => void;
}

export function ActionsPositionSelector(props: IProps): React.ReactElement {
    return (
        <select
            value={props.value}
            onChange={(event) => {
                return props.onChange(correctValue<TValue>(event.target.value));
            }}
        >
            <option value={undefined}>default</option>
            <option value={'inside'}>inside</option>
            <option value={'outside'}>outside</option>
            <option value={'custom'}>custom</option>
        </select>
    );
}
