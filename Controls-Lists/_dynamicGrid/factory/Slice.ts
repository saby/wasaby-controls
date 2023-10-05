import { RecordSet } from 'Types/collection';

import { IListLoadResult, IListState, List } from 'Controls/dataFactory';
import { format as EntityFormat, Model, Record as EntityRecord } from 'Types/entity';
import {
    IDynamicColumnsFilter,
    IDynamicColumnsNavigation,
    IDynamicGridDataFactoryArguments,
} from './IDynamicGridFactory';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    applyLoadedItems,
    prepareDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
    prepareLoadColumnsNavigation,
} from './utils';
import { TNavigationDirection } from 'Controls/interface';
import { unstable_batchedUpdates } from 'react-dom';
import {
    generateDynamicColumnsData,
    IGenerateDynamicColumnsData,
} from './DynamicColumnsGridDataGenerator';
import {
    ISelection,
    TCellsMultiSelectAccessibilityCallback,
    TCellsMultiSelectVisibility,
} from '../selection/SelectionContainer';
import { NAVIGATION_LIMIT_FACTOR } from 'Controls-Lists/_dynamicGrid/constants';

export interface IDynamicGridSliceState<TNavigationPosition = number, TColumnsGridData = number>
    extends IListState {
    staticColumns: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    staticHeaders: IHeaderConfig[];
    dynamicHeader: IHeaderConfig;
    columnsNavigation: IDynamicColumnsNavigation<TNavigationPosition>;
    columnsDataVersion: number;
    dynamicColumnsGridData: TColumnsGridData[];
    cellsMultiSelectVisibility: TCellsMultiSelectVisibility;
    selectedCells: ISelection;
    cellsMultiSelectAccessibilityCallback?: TCellsMultiSelectAccessibilityCallback;
}

export default class DynamicGridSlice<
    TColumnsNavigationPosition = number,
    TColumnsGridData = number
> extends List.slice {
    protected _columnsPosition: TColumnsNavigationPosition;
    protected state: IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;

    protected _generateDynamicColumnsData(
        props: IGenerateDynamicColumnsData<TColumnsNavigationPosition>
    ) {
        return generateDynamicColumnsData(props);
    }

    protected _initState(
        loadResult: IListLoadResult,
        config: IDynamicGridDataFactoryArguments<TColumnsNavigationPosition>
    ): IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData> {
        const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(
            config,
            config.columnsNavigation.sourceConfig.direction || 'bothways'
        );
        const dynamicColumnsGridData = this._generateDynamicColumnsData({ dynamicColumnsFilter });

        return {
            ...super._initState(loadResult, config),
            staticColumns: config.staticColumns,
            dynamicColumn: config.dynamicColumn,
            staticHeaders: config.staticHeaders,
            dynamicHeader: config.dynamicHeader,
            columnsNavigation: config.columnsNavigation,
            columnsDataVersion: 0,
            dynamicColumnsGridData,
            cellsMultiSelectVisibility: config.cellsMultiSelectVisibility || 'onhover',
            selectedCells: config.selectedCells || {},
            cellsMultiSelectAccessibilityCallback: config.cellsMultiSelectAccessibilityCallback,
        } as IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;
    }

    protected _initColumnsPosition(
        position: TColumnsNavigationPosition
    ): TColumnsNavigationPosition {
        return position;
    }

    protected _moveColumnsPosition(
        position: TColumnsNavigationPosition,
        direction: TNavigationDirection,
        shiftSize: number
    ): TColumnsNavigationPosition {
        if (direction === 'forward') {
            return ((position as number) + shiftSize) as TColumnsNavigationPosition;
        } else {
            return ((position as number) - shiftSize) as TColumnsNavigationPosition;
        }
    }

    private _loadColumns(direction: Exclude<TNavigationDirection, 'bothways'>): void {
        const filter = this.state.filter;
        const verticalNavigationField =
            this.state.sourceController.getNavigation().sourceConfig.field;
        const columnsNavigation = this.state.columnsNavigation;
        const dynamicColumnsDataProperty = columnsNavigation.sourceConfig.field;
        const items = this.state.sourceController.getItems();

        if (this._columnsPosition === undefined) {
            this._columnsPosition = this._initColumnsPosition(
                columnsNavigation.sourceConfig.position
            );
        }

        const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(this.state, direction);

        const preparedFilter = {
            ...filter,
            [dynamicColumnsDataProperty]:
                this._convertDynamicColumnsFilterToRecord(dynamicColumnsFilter),
        };

        const navigation = prepareLoadColumnsNavigation({
            position: items.at(0).get(verticalNavigationField),
            field: verticalNavigationField,
            itemsCount: items.getCount(),
        });

        this._columnsPosition = this._moveColumnsPosition(
            this._columnsPosition,
            direction,
            dynamicColumnsFilter.limit
        );
        const limit =
            this.state.columnsNavigation.sourceConfig.direction !== 'forward'
                ? dynamicColumnsFilter.limit * NAVIGATION_LIMIT_FACTOR
                : dynamicColumnsFilter.limit;
        const dynamicColumnsGridData = this._generateDynamicColumnsData({
            dynamicColumnsFilter: {
                ...dynamicColumnsFilter,
                position: this._columnsPosition,
                limit,
            },
        });
        unstable_batchedUpdates(() => {
            this.setState({
                columnsDataVersion: this.state.columnsDataVersion + 1,
                dynamicColumnsGridData,
            });
        });

        this.load('forward', undefined, preparedFilter, false, navigation)
            .then((loadedItems) => {
                unstable_batchedUpdates(() => {
                    this._applyLoadedItemsToHorizontalDirection(
                        loadedItems,
                        direction,
                        dynamicColumnsGridData
                    );
                });
            })
            .catch((error) => {
                return error;
            });
    }

    protected _applyLoadedItemsToHorizontalDirection(
        loadedItems: RecordSet,
        direction: Exclude<TNavigationDirection, 'bothways'>,
        dynamicColumnsGridData: TColumnsGridData[]
    ): void {
        const { field } = this.state.columnsNavigation.sourceConfig;
        applyLoadedItems({
            items: this.state.sourceController.getItems(),
            loadedItems,
            columnsDataProperty: field,
            dynamicColumnsGridData,
            direction,
        });
    }

    protected _prepareDynamicColumnsFilter(
        state: IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>,
        actualDirection: TNavigationDirection
    ): IDynamicColumnsFilter<TColumnsNavigationPosition> {
        const columnsNavigation = state.columnsNavigation;
        return prepareDynamicColumnsFilter({
            columnsNavigation,
            actualPosition: this._columnsPosition,
            actualDirection,
        });
    }

    protected _convertDynamicColumnsFilterToRecord(
        filter: IDynamicColumnsFilter<TColumnsNavigationPosition>
    ): EntityRecord {
        return prepareDynamicColumnsFilterRecord(
            filter,
            this.state.source.getAdapter(),
            EntityFormat.IntegerField
        );
    }

    protected _convertDynamicColumnsFilterRecordToObject(
        filter: Model
    ): IDynamicColumnsFilter<TColumnsNavigationPosition> {
        return {
            direction: filter.get('direction'),
            limit: filter.get('limit'),
            position: filter.get('position'),
        };
    }

    protected _beforeApplyState(
        nextState: IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
    ):
        | IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
        | Promise<IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>> {
        if (
            !nextState.operationsPanelVisible &&
            !Object.keys(this.state.selectedCells).length &&
            Object.keys(nextState.selectedCells).length
        ) {
            this.openOperationsPanel();
        }
        // При смене корня формируем фильтр запроса данных для динамических колонок.
        if (nextState.root !== this.state.root) {
            const { field } = nextState.columnsNavigation.sourceConfig;

            const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(
                nextState,
                nextState.columnsNavigation.sourceConfig.direction || 'bothways'
            );

            nextState.filter = {
                ...nextState.filter,
                [field]: this._convertDynamicColumnsFilterToRecord(dynamicColumnsFilter),
            };
        }

        return super._beforeApplyState(nextState);
    }

    protected _dataLoaded(
        items: RecordSet,
        direction: TNavigationDirection,
        nextState: IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
    ): Partial<IDynamicGridSliceState> | Promise<Partial<IDynamicGridSliceState>> {
        const { field } = nextState.columnsNavigation.sourceConfig;
        const dynamicColumnsFilter = this._convertDynamicColumnsFilterRecordToObject(
            nextState.filter[field]
        );
        nextState.dynamicColumnsGridData = this._generateDynamicColumnsData({
            dynamicColumnsFilter,
        });

        return super._dataLoaded(items, direction, nextState);
    }

    loadBackwardColumns() {
        if (this.state.columnsNavigation.sourceConfig.direction !== 'forward') {
            this._loadColumns('backward');
        }
    }

    loadForwardColumns() {
        this._loadColumns('forward');
    }
}
