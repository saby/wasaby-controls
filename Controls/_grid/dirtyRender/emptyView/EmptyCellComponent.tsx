/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';

import { RecordSet } from 'Types/collection';

import { TInternalProps } from 'UICore/Executor';
import { IHashMap } from 'Types/declarations';
import { TGridHPaddingSize, TGridVPaddingSize } from 'Controls/interface';

import { getUserClassName, GridEmptyRow, GridEmptyCell } from 'Controls/baseGrid';

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
        cellModel?.getInnerContentWrapperClasses(
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

function getHasEmptyViewClasses(props) {
    const cellModel = props.gridColumn || props.emptyViewColumn;
    if (cellModel?.getHasEmptyView()) {
        return getAlignClasses(props.halign);
    } else {
        return cellModel?.getWrapperClasses(props.backgroundColorStyle, props.highlightOnHover);
    }
}

function EmptyCellComponent(
    props: IEmptyCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const cellModel = props.gridColumn || props.emptyViewColumn;
    const wrapperClassName =
        'controls-BaseControl__emptyTemplate ' +
        cellModel?.getContentClasses(props.topSpacing, props.bottomSpacing, props.align) +
        getHorizontalOffsetClasses(props.paddingLeft, props.paddingRight) +
        getVerticalPaddingsClasses(props.paddingTop, props.paddingBottom) +
        ` ${getHasEmptyViewClasses(props)}` +
        ` ${getUserClassName(props)}`;

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
