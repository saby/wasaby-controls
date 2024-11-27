/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { getBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/BaseCell';
import BaseCellComponent, {
    IBaseCellComponentProps,
} from 'Controls/_grid/cleanRender/cell/BaseCellComponent';
import { GridEmptyCell, GridEmptyRow } from 'Controls/gridDisplay';
import {IPadding} from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { IHashMap } from 'Types/declarations';

interface IEmptyCellComponentProps extends IBaseCellComponentProps {
    item: GridEmptyRow;
    itemData: GridEmptyRow;
    colData: GridEmptyRow;

    gridColumn: GridEmptyCell;
    emptyViewColumn: GridEmptyCell;

    content: React.Component | React.FunctionComponent;
    className?: string;

    topSpacing: string;
    bottomSpacing: string;
    align: 'center' | 'start' | 'end';

    padding: IPadding;

    items: RecordSet;
    filter: IHashMap<unknown>;

    // colspan
    startColspanIndex?: number; // ?
    endColspanIndex?: number;
}


function getStyle(
    props: Pick<IEmptyCellComponentProps, 'style' | 'startColspanIndex' | 'endColspanIndex'>
): React.CSSProperties | undefined {
    const { startColspanIndex, endColspanIndex } = props;
    // В случае колспана
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

function HeaderCellComponent(
    props: IEmptyCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const wrapperRenderClassName = '';
    const wrapperRenderStyle = getStyle(props);

    // У пустого нет рендера по умолчанию ,оно показывает то, что ему отдали сверху.
    const contentRender = props.render || props.contentRender;

    return (
        <BaseCellComponent
            {...getBaseCellComponentProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            style={wrapperRenderStyle}
            contentRender={contentRender}
        />
    );
}

export default React.forwardRef(HeaderCellComponent);
