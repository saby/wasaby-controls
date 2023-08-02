import * as React from 'react';
import { IFontColorStyleOptions, IFontWeightOptions, IFontSizeOptions } from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';

export interface IDataTypeRenderProps<TValue>
    extends IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        TInternalProps {
    tooltip: string;
    value: TValue;
    highlightedValue?: string | number | string[];
    displayTypeOptions?: object;

    onMouseMove?: React.MouseEventHandler;
    onMouseDown?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onTouchStart?: React.MouseEventHandler;
    onClick?: React.MouseEventHandler;

    className: string;
}
