import * as React from 'react';
import { TOffsetSize } from 'Controls/interface';
import {
    _useGridAutoScrollTargetsStyles as useGridAutoScrollTargetsStyles,
    _TUseGridAutoScrollTargetsStylesProps as TUseGridAutoScrollTargetsStylesProps,
} from 'Controls/gridColumnScroll';
import { AutoScrollTargetElement } from 'Controls/columnScrollReact';

export type TBeforeItemsContentProps = Omit<
    TUseGridAutoScrollTargetsStylesProps,
    'hasResizer' | 'columnsCount'
> & {
    children?: JSX.Element;
    dynamicColumnsLength: number;
    columnsSpacing: TOffsetSize;
};

export function BeforeItemsContent(props: TBeforeItemsContentProps): JSX.Element {
    const { startFixedCellStyle, scrollableCellStyles, endFixedCellStyle } =
        useGridAutoScrollTargetsStyles({
            ...props,
            columnsCount: 1 + props.stickyColumnsCount + props.endStickyColumnsCount,
            hasResizer: false,
        });

    const targetClassName = props.columnsSpacing
        ? `ControlsLists-dynamicGrid__autoScrollTarget_columns-spacing_${props.columnsSpacing}`
        : '';

    const wrapperStyles: React.CSSProperties = {
        ...scrollableCellStyles[0],
        gridTemplateColumns: `repeat(${props.dynamicColumnsLength}, auto)`,
    };

    return (
        <>
            <div className="tw-contents">
                {startFixedCellStyle && <div style={startFixedCellStyle} />}

                <div
                    className="ControlsLists-dynamicGrid__autoScrollTargetsWrapper"
                    style={wrapperStyles}
                >
                    {Array.from({ length: props.dynamicColumnsLength }, (_, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <AutoScrollTargetElement key={index} className={targetClassName} />
                    ))}
                </div>

                {endFixedCellStyle && <div style={endFixedCellStyle} />}
            </div>

            {props.children}
        </>
    );
}

const BeforeItemsContentMemo = React.memo(BeforeItemsContent);
export default BeforeItemsContentMemo;
