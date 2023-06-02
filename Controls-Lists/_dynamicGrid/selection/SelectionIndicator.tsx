import * as React from 'react';
import { GridSelectionContext } from './gridContext/GridSelectionContext';
import { RowSelectionContext } from './rowContext/RowSelectionContext';

const SelectionIndicatorRender = React.memo(function SelectionIndicatorRender(): JSX.Element {
    const ctx = React.useContext(RowSelectionContext);

    const render = React.useMemo(() => {
        const selections = ctx.rowSelection;

        return Object.keys(ctx.rowSelection)
            .filter(
                (key) =>
                    typeof selections[key].gridColumnStart !== 'undefined' &&
                    typeof selections[key].gridColumnEnd !== 'undefined'
            )
            .map((key) => (
                <div
                    key={`${selections[key].firstColumnKey}_${selections[key].lastColumnKey}`}
                    className="ControlsLists-dynamicGrid__selection__indicator"
                    style={{
                        gridColumnStart: selections[key].gridColumnStart,
                        gridColumnEnd: selections[key].gridColumnEnd,
                    }}
                />
            ));
    }, [ctx.rowSelection]);

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{render}</>;
});

export const SelectionIndicator = React.memo(function SelectionIndicator() {
    const ctx = React.useContext(GridSelectionContext);

    if (ctx.isEnabled) {
        return <SelectionIndicatorRender/>;
    } else {
        return null;
    }
});
