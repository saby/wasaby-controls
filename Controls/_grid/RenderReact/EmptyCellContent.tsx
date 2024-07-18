import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';
import type { RecordSet } from 'Types/collection';
import { IHashMap } from 'Types/declarations';
import { EmptyWrapper } from 'Controls/baseList';
import { getUserClassName } from '../utils/getUserArgsCompatible';
import type EmptyRow from 'Controls/_baseGrid/display/EmptyRow';
import type EmptyCell from 'Controls/_baseGrid/display/EmptyCell';
import type { TContentAlign } from 'Controls/_baseGrid/display/EmptyCell';

interface IProps extends TInternalProps {
    item: EmptyRow;
    itemData: EmptyRow;
    colData: EmptyRow;

    gridColumn: EmptyCell;
    emptyViewColumn: EmptyCell;

    contentTemplate: React.Component | React.FunctionComponent;
    content: React.Component | React.FunctionComponent;
    className?: string;

    topSpacing: string;
    bottomSpacing: string;
    align: TContentAlign;

    items: RecordSet;
    filter: IHashMap<unknown>;
}

function getStyle(viewportWidth?: number, isActsAsRowTemplate?: boolean): React.CSSProperties {
    if (!viewportWidth || !isActsAsRowTemplate) {
        return null;
    }

    return {
        width: `${viewportWidth}px`,
    };
}

function EmptyCellContent(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const template = props.contentTemplate || props.content;
    if (!template) {
        return null;
    }

    const cellModel = props.gridColumn || props.emptyViewColumn;
    const emptyRowModel = props.item || props.itemData || props.colData;
    const templateProps = {
        column: cellModel,
        emptyViewColumn: cellModel,
    };

    const wrapperClassName =
        cellModel.getContentClasses(props.topSpacing, props.bottomSpacing, props.align) +
        ` ${getUserClassName(props)}`;
    const innerClassName = cellModel.getInnerContentWrapperClasses(
        props.topSpacing,
        props.bottomSpacing,
        props.align
    );
    const inlineStyle = getStyle(
        emptyRowModel.getContainerSize?.(),
        cellModel?.isActsAsRowTemplate?.()
    );

    return (
        <EmptyWrapper
            ref={ref}
            className={wrapperClassName}
            innerClassName={innerClassName}
            style={inlineStyle}
            template={template}
            templateProps={templateProps}
            item={emptyRowModel}
            items={props.items}
            filter={props.filter}
        />
    );
}

export default React.forwardRef(EmptyCellContent);
