import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IFontColorStyleOptions, IFontWeightOptions, IFontSizeOptions } from 'Controls/interface';
import { TOverflow } from './IColumn';
import DataCell from '../DataCell';

export interface IDataTypeRenderProps<TValue>
    extends IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        TInternalProps {
    tooltip: string;
    value: TValue;
    highlightedValue?: string | number | string[];
    displayTypeOptions?: object;
    textOverflow: TOverflow;
    column?: DataCell;

    onMouseMove?: React.MouseEventHandler;
    onMouseDown?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onTouchStart?: React.MouseEventHandler;
    onClick?: React.MouseEventHandler;

    className: string;
}
