/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import { TNavigationDirection } from 'Controls/interface';
import { DynamicGridComponent } from './Component';
import {
    IBaseDynamicGridComponentProps,
    IColumnsEndedCallback,
} from './interfaces/IDynamicGridComponent';
import DynamicGridSlice, { IDynamicGridSliceState } from './factory/Slice';

export function getColumnsEndedCallback(slice: DynamicGridSlice): IColumnsEndedCallback {
    return (direction: TNavigationDirection) => {
        if (direction === 'forward') {
            slice.loadForwardColumns();
        } else {
            slice.loadBackwardColumns();
        }
    };
}

function ConnectedComponentRef(
    props: IBaseDynamicGridComponentProps,
    ref?: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const slice = React.useContext(DataContext)[props.storeId] as unknown as DynamicGridSlice &
        IDynamicGridSliceState;

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
            eventRender={props.eventRender}
            viewMode={slice.viewMode}
            dynamicDataProperty={slice.columnsNavigation.sourceConfig.field}
            staticColumns={slice.staticColumns}
            endStaticColumns={slice.endStaticColumns}
            dynamicColumn={slice.dynamicColumn}
            dynamicColumnsCount={slice.dynamicColumnsGridData.length}
            staticHeaders={slice.staticHeaders}
            endStaticHeaders={slice.endStaticHeaders}
            dynamicHeader={slice.dynamicHeader}
            staticFooter={slice.staticFooter}
            dynamicFooter={slice.dynamicFooter}
            dynamicColumnsGridData={slice.dynamicColumnsGridData}
            columnsDataVersion={slice.columnsDataVersion}
            multiSelectVisibility={slice.multiSelectVisibility}
            cellsMultiSelectVisibility={slice.cellsMultiSelectVisibility}
            cellsMultiSelectAccessibilityCallback={slice.cellsMultiSelectAccessibilityCallback}
            selectedCells={slice.selectedCells}
            refOnlyForWasaby={ref}
            onSelectedCellsChanged={onSelectedCellsChanged}
            onBeforeSelectedCellsChanged={undefined}
            columnsEndedCallback={columnsEndedCallback}
        />
    );
}

const ConnectedComponent = React.forwardRef(ConnectedComponentRef);

export default ConnectedComponent;

/**
 * Компонент “Таблица с загружаемыми колонками”.
 *
 * Компонент обеспечивает навигацию по колонкам.
 * Работает с данными через слайс, формируемый фабрикой Controls-Lists/dynamicGrid:DynamicGridFactory.
 * @class Controls-Lists/_dynamicGrid/ConnectedComponent
 * @implements Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IBaseDynamicGridComponentProps
 * @demo Controls-Lists-demo/dynamicGrid/base/Index
 * @public
 */
