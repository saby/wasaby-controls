/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';

import { RecordSet } from 'Types/collection';

import { TInternalProps } from 'UICore/Executor';
import { IHashMap } from 'Types/declarations';
import { TGridHPaddingSize, TGridVPaddingSize } from 'Controls/interface';

import { GridEmptyRow, GridEmptyCell } from 'Controls/baseGrid';

import { getBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/BaseCell';
import {
    getHorizontalOffsetClasses,
    getVerticalPaddingsClasses,
} from 'Controls/_grid/cleanRender/cell/utils/Classes/Offset';
import {
    default as BaseCellComponent,
    IBaseCellComponentProps,
} from 'Controls/_grid/cleanRender/cell/BaseCellComponent';
import { getAlignClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/Align';

export interface IEmptyCellComponentProps extends IBaseCellComponentProps, TInternalProps {
    item: GridEmptyRow;
    itemData: GridEmptyRow;
    colData: GridEmptyRow;

    gridColumn: GridEmptyCell;
    emptyViewColumn: GridEmptyCell;

    contentTemplate: React.Component | React.FunctionComponent;
    content: React.Component | React.FunctionComponent;
    className?: string;

    topSpacing: string;
    bottomSpacing: string;
    align: 'center' | 'start' | 'end';

    paddingLeft: TGridHPaddingSize;
    paddingRight: TGridHPaddingSize;
    paddingTop: TGridVPaddingSize;
    paddingBottom: TGridVPaddingSize;

    items: RecordSet;
    filter: IHashMap<unknown>;
}

function getStyle(
    props: Pick<IEmptyCellComponentProps, 'style' | 'startColspanIndex' | 'endColspanIndex'>
): React.CSSProperties | undefined {
    const { startColspanIndex, endColspanIndex } = props;
    if (startColspanIndex && endColspanIndex) {
        return {
            ...props.style,
            gridColumn: `${startColspanIndex} / ${endColspanIndex}`,
        };
    }
    return {
        ...props.style,
    };
}

function getInnerContentWrapperClasses(
    cell: GridEmptyCell | undefined,
    topSpacing = 'l',
    bottomSpacing = 'l',
    align = 'center'
) {
    const hasRowTemplate = cell?.getOwner().getRowTemplate();

    if (cell?.isSingleColspanedCell && hasRowTemplate) {
        return (
            'controls-ListView__empty' +
            ` controls-ListView__empty-textAlign_${align}` +
            ` controls-ListView__empty_topSpacing_${topSpacing}` +
            ` controls-ListView__empty_bottomSpacing_${bottomSpacing} ` +
            (align !== 'center' ? cell?._getHorizontalPaddingClasses({}) : ' ')
        );
    }

    return ' controls-GridView__emptyTemplate';
}

function getWrapperClasses(
    cell: GridEmptyCell | undefined,
    props: Pick<IEmptyCellComponentProps, 'backgroundColorStyle' | 'highlightOnHover' | 'halign'>
) {
    if (!cell) {
        return ' ';
    }

    if (cell?.getHasEmptyView()) {
        return getAlignClasses(props?.halign);
    }

    const columnScrollClasses = cell?.getOwner().hasColumnScroll()
        ? cell?._getColumnScrollWrapperClasses()
        : '';

    const backgroundColorStyle =
        props?.backgroundColorStyle ||
        cell?.getOwner().getRowTemplateOptions()?.backgroundColorStyle ||
        'editing';

    const hasRowTemplate = cell?.getOwner().getRowTemplate();

    if (cell?.isSingleColspanedCell && hasRowTemplate) {
        return columnScrollClasses + ' ' + cell?._getColumnSeparatorClasses();
    }

    if (cell?.isMultiSelectColumn()) {
        return (
            `controls-GridView__emptyTemplate__checkBoxCell controls-Grid__row-cell-editing ${columnScrollClasses}` +
            getBackgroundColorStyleClasses(backgroundColorStyle) +
            ' ' +
            cell?._getColumnSeparatorClasses()
        );
    }

    return (
        cell?.getWrapperClasses(backgroundColorStyle, props?.highlightOnHover) +
        getBackgroundColorStyleClasses(backgroundColorStyle) +
        ' ' +
        cell?._getColumnSeparatorClasses()
    );
}

function getContentClasses(
    cell: GridEmptyCell | undefined,
    props: Pick<IEmptyCellComponentProps, 'align'>
) {
    if (!cell) {
        return ' ';
    }

    const hasRowTemplate = cell?.getOwner().getRowTemplate();

    // Если пустое представление тянется (по умолчанию), то мы используем выравнивание контента флексом
    if (
        cell?.isSingleColspanedCell &&
        hasRowTemplate &&
        cell?.config.templateOptions?.height !== 'auto'
    ) {
        return (
            ` controls-GridView__emptyTemplate_stretch controls-GridView__emptyTemplate_stretch_align_${
                props?.align || 'center'
            } ` + cell?._getRoundBorderClasses()
        );
    }

    if (cell?.isMultiSelectColumn()) {
        return ' ';
    }

    return (
        ' controls-Grid__row-cell__content' +
        ' controls-GridView__emptyTemplate__cell' +
        ' controls-Grid__row-cell-editing' +
        ' controls-Grid__row-cell__content_baseline_default ' +
        cell?._getRoundBorderClasses()
    );
}

function getBackgroundColorStyleClasses(backgroundColorStyle: string) {
    if (backgroundColorStyle === 'editing') {
        return ' controls-Grid__row-cell-background-editing_default';
    }
    return ' ';
}

export const EmptyContentRenderForwardRef = React.forwardRef(function EmptyContentRender(
    props: IEmptyCellComponentProps,
    ref: React.ForwardedRef<HTMLElement>
) {
    if (!props.contentRender) {
        return null;
    }

    const cellModel = props.gridColumn || props.emptyViewColumn;
    const emptyRowModel = props.item || props.itemData || props.colData;
    const templateProps = {
        column: cellModel,
        emptyViewColumn: cellModel,
        ...emptyRowModel?.getItemTemplateOptions?.(),
    };

    const innerClassName =
        'controls-BaseControl__emptyTemplate__contentWrapper ' +
        getInnerContentWrapperClasses(
            cellModel,
            props.topSpacing,
            props.bottomSpacing,
            props.align
        );

    if (props.fromTemplate) {
        return createElement(props.contentRender, {
            ...templateProps,
            item: emptyRowModel,
            items: props.items,
            filter: props.filter,
        });
    }

    return (
        <div className={innerClassName} ref={ref}>
            {createElement(props.contentRender, {
                ...templateProps,
                item: emptyRowModel,
                items: props.items,
                filter: props.filter,
            })}
        </div>
    );
});

function EmptyCellComponent(
    props: IEmptyCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const cellModel = props.gridColumn || props.emptyViewColumn;
    const wrapperClassName =
        'controls-BaseControl__emptyTemplate ' +
        getContentClasses(cellModel, props.align) +
        getHorizontalOffsetClasses(props.paddingLeft, props.paddingRight) +
        getVerticalPaddingsClasses(props.paddingTop, props.paddingBottom) +
        ` ${getWrapperClasses(
            cellModel,
            props.backgroundColorStyle,
            props.highlightOnHover,
            props.halign
        )}` +
        ` ${props.className || ''}`;

    const inlineStyle = getStyle(props);

    const contentRender = props.render || props.contentRender;

    return (
        <BaseCellComponent
            {...getBaseCellComponentProps(props)}
            ref={ref}
            className={wrapperClassName}
            style={inlineStyle}
            contentRender={contentRender}
        />
    );
}

export default React.forwardRef(EmptyCellComponent);
