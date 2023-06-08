import * as React from 'react';

import type { IGridProps } from 'Controls/gridColumnScroll';

type TValue = IGridProps['columnScrollViewMode'];
interface IProps {
    value: TValue;
    onChange: (value: TValue) => void;
}

export function ColumnScrollViewModeSelector(
    props: IProps
): React.ReactElement {
    return (
        <select
            value={props.value}
            onChange={(event) => {
                return props.onChange(
                    event.target.value === 'undefined'
                        ? undefined
                        : (event.target.value as TValue)
                );
            }}
        >
            <option value={undefined}>undefined</option>
            <option value={'scrollbar'}>scrollbar</option>
            <option value={'arrows'}>arrows</option>
            <option value={'unaccented'}>unaccented</option>
        </select>
    );
}
