import * as React from 'react';
import { TSize } from 'Controls/interface';

type TRangeType = 'standardized' | 'grid-v-padding' | 'grid-h-padding';
type TValue = TSize | undefined;
interface IProps {
    value: TValue;
    onChange: (value: TValue) => void;
    rangeType?: TRangeType;
}

function correctValue(value: string): TValue {
    if (value === 'default') {
        return undefined;
    }

    return value as TValue;
}

export function SizeSelector(props: IProps): React.ReactElement {
    const options = ['null', '3xs', '2xs', 'xs', 's', 'st', 'm', 'l', 'xl', '2xl', '3xl'];

    if (props.rangeType === 'grid-v-padding') {
        options.push('grid_s', 'grid_l');
    }
    if (props.rangeType === 'grid-h-padding') {
        options.push('grid_s', 'grid_m');
    }

    return (
        <select
            value={props.value}
            onChange={(event) => {
                return props.onChange(correctValue(event.target.value));
            }}
        >
            <option value={undefined}>default</option>
            {options.map((size) => {
                return (
                    <option value={size} key={size}>
                        {size}
                    </option>
                );
            })}
        </select>
    );
}
