/**
 * Компонент "Таблица с загружаемыми колонками с подключенным механизмом слайсов"
 * @class Controls-Lists/dynamicGrid:ConnectedComponent
 * @public
 * @demo Controls-Lists-demo/dynamicGrid/base/Index
 */

import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import { TNavigationDirection } from 'Controls/interface';
import {
    DynamicGridComponent,
    IColumnsEndedCallback,
    IDynamicGridComponentProps,
} from './Component';
import DynamicGridSlice from './factory/Slice';

// TODO: Тип Connected компонента должен быть гораздо уже и не прокидывать опции скоупом.
//  Пока делаю правильно только для selection аспекта.

// TODO: Тип не должен называться в I аннотации, пропсы должны быть типом.
export type IDynamicGridConnectedComponentProps = Omit<
    IDynamicGridComponentProps,
    | 'cellsMultiSelectVisibility'
    | 'selectedCells'
    | 'onSelectedCellsChanged'
    | 'onBeforeSelectedCellsChanged'
>;

export function getColumnsEndedCallback(slice: DynamicGridSlice): IColumnsEndedCallback {
    return (direction: TNavigationDirection) => {
        if (direction === 'forward') {
            slice.loadForwardColumns();
        } else {
            slice.loadBackwardColumns();
        }
    };
}

export const DynamicGridConnectedComponent = React.forwardRef(
    (
        props: IDynamicGridConnectedComponentProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement => {
        const slice = React.useContext(DataContext)[props.storeId] as unknown as DynamicGridSlice;

        const columnsEndedCallback = React.useCallback(getColumnsEndedCallback(slice), [slice]);

        const onSelectedCellsChanged = React.useCallback(
            (selectedCells) => {
                slice.setState({
                    selectedCells,
                });
            },
            [slice]
        );

        return (
            <DynamicGridComponent
                {...props}
                refOnlyForWasaby={ref}
                viewMode={slice.viewMode}
                parentProperty={slice.parentProperty}
                nodeProperty={slice.nodeProperty}
                staticColumns={slice.staticColumns}
                endStaticColumns={slice.endStaticColumns}
                dynamicColumn={slice.dynamicColumn}
                eventRender={props.eventRender}
                eventsProperty={props.eventsProperty}
                eventStartProperty={props.eventStartProperty}
                eventEndProperty={props.eventEndProperty}
                dynamicColumnsCount={slice.columnsNavigation.sourceConfig.limit}
                staticHeaders={slice.staticHeaders}
                endStaticHeaders={slice.endStaticHeaders}
                dynamicHeader={slice.dynamicHeader}
                staticFooter={slice.staticFooter}
                dynamicFooter={slice.dynamicFooter}
                columnsEndedCallback={columnsEndedCallback}
                dynamicColumnsGridData={slice.dynamicColumnsGridData}
                columnsDataVersion={slice.columnsDataVersion}
                multiSelectVisibility={slice.multiSelectVisibility}
                cellsMultiSelectVisibility={slice.cellsMultiSelectVisibility}
                cellsMultiSelectAccessibilityCallback={slice.cellsMultiSelectAccessibilityCallback}
                selectedCells={slice.selectedCells}
                onSelectedCellsChanged={onSelectedCellsChanged}
                onBeforeSelectedCellsChanged={undefined}
            />
        );
    }
);
