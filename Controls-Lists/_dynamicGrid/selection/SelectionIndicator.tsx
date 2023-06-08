import * as React from 'react';
import { ISelection } from './interfaces';
import { GridSelectionContext } from './gridContext/GridSelectionContext';
import { RowSelectionContext } from './rowContext/RowSelectionContext';
import { TOffsetSize } from 'Controls/interface';

export interface ISelectionIndicatorRenderProps {
    itemsSpacing: TOffsetSize;
}

const SelectionIndicatorRender = React.memo(function SelectionIndicatorRender(
    props: ISelectionIndicatorRenderProps
): JSX.Element {
    const ctx = React.useContext(RowSelectionContext);

    const render = React.useMemo(() => {
        const selections = ctx.rowSelection;

        return Object.keys(ctx.rowSelection)
            .filter(
                (key) =>
                    typeof selections[key].gridColumnStart !== 'undefined' &&
                    typeof selections[key].gridColumnEnd !== 'undefined'
            )
            .map((key) => {
                const selection: ISelection = selections[key];
                let className = 'ControlsLists-dynamicGrid__selection__indicator';

                if (!selection.hasBorderTop) {
                    className += ' ControlsLists-dynamicGrid__selection__indicator_colspanTop';

                    if (props.itemsSpacing) {
                        className += ` ControlsLists-dynamicGrid__selection__indicator_colspanTop_${props.itemsSpacing}`;
                    }
                }

                if (!selection.hasBorderBottom) {
                    className += ' ControlsLists-dynamicGrid__selection__indicator_colspanBottom';
                }

                return (
                    <div
                        key={`${selection.firstColumnKey}_${selection.lastColumnKey}`}
                        className={className}
                        style={{
                            gridColumnStart: selection.gridColumnStart,
                            gridColumnEnd: selection.gridColumnEnd,
                        }}
                    />
                );
            });
    }, [ctx.rowSelection, props.itemsSpacing]);

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{render}</>;
});

export const SelectionIndicator = React.memo(function SelectionIndicator() {
    const ctx = React.useContext(GridSelectionContext);

    if (ctx.isEnabled) {
        return <SelectionIndicatorRender itemsSpacing={ctx.itemsSpacing} />;
    } else {
        return null;
    }
});
