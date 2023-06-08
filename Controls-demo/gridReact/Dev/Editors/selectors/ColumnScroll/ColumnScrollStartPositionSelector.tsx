import * as React from 'react';
import BaseSelector from '../../base/BaseSelector';

import type { IGridProps } from 'Controls/gridColumnScroll';

type TValue = undefined | IGridProps['columnScrollStartPosition'];

interface IProps {
    value: TValue;
    onChange: (value: TValue) => void;
}

const convertInputValueToProp = (value: string): TValue => {
    if (value === 'undefined') {
        return undefined;
    } else if (value === 'end') {
        return 'end';
    } else {
        return +value;
    }
};

export function ColumnScrollStartPositionSelector(
    props: IProps
): React.ReactElement {
    return (
        <BaseSelector header={'columnScrollStartPosition'}>
            <select
                value={'' + props.value}
                className={'controls-margin_right-s'}
                onChange={(event) => {
                    return props.onChange(
                        convertInputValueToProp(event.target.value)
                    );
                }}
            >
                <option value={'undefined'}>undefined</option>
                <option value={'100'}>100px</option>
                <option value={'150'}>150px</option>
                <option value={'300'}>300px</option>
                <option value={'600'}>600px</option>
                <option value={'9000'}>9000px</option>
                <option value={'end'}>end</option>
            </select>
        </BaseSelector>
    );
}
