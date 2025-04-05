/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { TInternalProps } from 'UICore/Executor';
import type { IItemEventHandlers, IItemTemplateProps } from 'Controls/baseList';
import type { GridRow, GridCell } from 'Controls/gridDisplay';
import {
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
    TBackgroundStyle,
} from 'Controls/interface';

type TPaddingSize = 'xs' | 'null';

export interface IItemsContainerPadding {
    left?: TPaddingSize;
    right?: TPaddingSize;
}

/**
 * Интерфейс компонента для рендера совместимой с wasaby-синтаксисом строки таблицы.
 * @private
 */
export interface ICompatibleRowComponentProps<
    TContents extends Model = Model,
    TItem extends GridRow<TContents> = GridRow<TContents>,
> extends TInternalProps,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        IItemEventHandlers,
        IItemTemplateProps<TContents, TItem> {
    hoverBackgroundStyle: TBackgroundStyle;
    backgroundStyle: TBackgroundStyle;
    fixedBackgroundStyle: TBackgroundStyle;
    templateHighlightOnHover: boolean;
    editable: boolean;
    clickable: boolean;
    stickyCallback: Function;
    isSticked: boolean;
    containerSize: number;
    itemsContainerPadding?: IItemsContainerPadding;

    _onBreadcrumbClick: Function;
    _onBreadcrumbItemClick: Function;

    onTagClick: (event: React.BaseSyntheticEvent, item: GridRow, columnIndex: number) => void;
    onTagHover: (event: React.BaseSyntheticEvent, item: GridRow, columnIndex: number) => void;

    columnOptions: object;
    beforeColumnContentTemplate:
        | React.Component<IItemProps & { column: GridCell }>
        | React.FunctionComponent<IItemProps & { column: GridCell }>;
    afterColumnContentTemplate:
        | React.Component<IItemProps & { column: GridCell }>
        | React.FunctionComponent<IItemProps & { column: GridCell }>;
}
