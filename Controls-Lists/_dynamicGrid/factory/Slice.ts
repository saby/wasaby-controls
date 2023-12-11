import { RecordSet } from 'Types/collection';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { IListLoadResult, IListState, List } from 'Controls/dataFactory';
import { format as EntityFormat, Model, Record as EntityRecord } from 'Types/entity';
import {
    IDynamicColumnsFilter,
    IDynamicColumnsNavigation,
    IDynamicGridDataFactoryArguments,
    TColumnsNavigationMode,
} from './IDynamicGridFactory';
import { IColumnConfig, IFooterConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    applyLoadedItems,
    prepareDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
    prepareLoadColumnsNavigation,
} from './utils';
import * as cClone from 'Core/core-clone';
import { TNavigationDirection } from 'Controls/interface';
import { unstable_batchedUpdates } from 'react-dom';
import {
    generateDynamicColumnsData,
    generateDynamicColumnsDataByItems,
} from './DynamicColumnsGridDataGenerator';
import {
    ISelection,
    TCellsMultiSelectAccessibilityCallback,
    TCellsMultiSelectVisibility,
} from '../selection/SelectionContainer';
import { NAVIGATION_LIMIT_FACTOR } from 'Controls-Lists/_dynamicGrid/constants';

const META_DATA_COLUMNS_MORE_FIELD = 'columnsMore';

const MAX_FILTER_JOIN = 3;

export interface IDynamicGridSliceState<TNavigationPosition = number, TColumnsGridData = number>
    extends IListState {
    staticColumns: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    staticHeaders: IHeaderConfig[];
    dynamicHeader: IHeaderConfig;
    staticFooter?: IFooterConfig;
    dynamicFooter?: IFooterConfig[];
    columnsNavigation: IDynamicColumnsNavigation<TNavigationPosition>;
    columnsDataVersion: number;
    dynamicColumnsGridData: TColumnsGridData[];
    cellsMultiSelectVisibility: TCellsMultiSelectVisibility;
    selectedCells: ISelection;
    cellsMultiSelectAccessibilityCallback?: TCellsMultiSelectAccessibilityCallback;
}

interface IUpdateDynamicColumnsData {
    columnsPositionShiftSize: number;
    direction: TNavigationDirection;
    dynamicColumnsDataProperty: string;
    dynamicColumnsFilter: IDynamicColumnsFilter<unknown>;
    items: RecordSet;
}

export interface IDynamicSliceGenerateDynamicColumnsData {
    dynamicColumnsFilter: IDynamicColumnsFilter<unknown>;
    items: RecordSet;
    dynamicColumnsDataProperty: string;
    columnsNavigationMode: TColumnsNavigationMode;
}

export default class DynamicGridSlice<
    TColumnsNavigationPosition = number,
    TColumnsGridData = number
> extends List.slice {
    protected _columnsPosition: TColumnsNavigationPosition;
    protected _filterStack: IDynamicColumnsFilter<TColumnsNavigationPosition>[] = [];
    protected state: IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;

    protected _generateDynamicColumnsData(props: IDynamicSliceGenerateDynamicColumnsData) {
        const { columnsNavigationMode, dynamicColumnsDataProperty, dynamicColumnsFilter, items } =
            props;

        if (columnsNavigationMode === 'limited') {
            return generateDynamicColumnsDataByItems(items, dynamicColumnsDataProperty);
        } else {
            return generateDynamicColumnsData(dynamicColumnsFilter);
        }
    }

    protected _initState(
        loadResult: IListLoadResult,
        config: IDynamicGridDataFactoryArguments<TColumnsNavigationPosition>
    ): IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData> {
        const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(
            config,
            config.columnsNavigation.sourceConfig.direction || 'bothways'
        );
        const dynamicColumnsGridData = this._generateDynamicColumnsData({
            columnsNavigationMode: this._getColumnsNavigationMode(),
            dynamicColumnsDataProperty: config.columnsNavigation.sourceConfig.field,
            dynamicColumnsFilter,
            items: loadResult.items,
        });

        return {
            ...super._initState(loadResult, { ...config, deepScrollLoad: true }),
            staticColumns: config.staticColumns,
            dynamicColumn: config.dynamicColumn,
            staticHeaders: config.staticHeaders,
            dynamicHeader: config.dynamicHeader,
            staticFooter: config.staticFooter,
            dynamicFooter: config.dynamicFooter,
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

    private _updateDynamicColumnsData(props: IUpdateDynamicColumnsData) {
        const {
            columnsPositionShiftSize,
            direction,
            dynamicColumnsDataProperty,
            dynamicColumnsFilter,
            items,
        } = props;

        const dynamicColumnsDataLimit =
            this.state.columnsNavigation.sourceConfig.direction !== 'forward'
                ? dynamicColumnsFilter.limit * NAVIGATION_LIMIT_FACTOR
                : dynamicColumnsFilter.limit;

        this._columnsPosition = this._moveColumnsPosition(
            this._columnsPosition,
            direction,
            columnsPositionShiftSize
        );

        const dynamicColumnsGridData = this._generateDynamicColumnsData({
            columnsNavigationMode: this._getColumnsNavigationMode(),
            dynamicColumnsDataProperty,
            dynamicColumnsFilter: {
                ...dynamicColumnsFilter,
                position: this._columnsPosition,
                limit: dynamicColumnsDataLimit,
            },
            items,
        });

        unstable_batchedUpdates(() => {
            this.setState({
                columnsDataVersion: this.state.columnsDataVersion + 1,
                dynamicColumnsGridData,
            });
        });
    }

    private _loadColumns(direction: Exclude<TNavigationDirection, 'bothways'>): void {
        const filter = SourceController.prepareFilterWithExpandedItems(
            this.state.filter,
            this.state.expandedItems,
            this.state.parentProperty,
            this.state.root
        );
        const verticalNavigationConfig = this.state.sourceController.getNavigation().sourceConfig;
        const columnsNavigation = this.state.columnsNavigation;
        const dynamicColumnsDataProperty = columnsNavigation.sourceConfig.field;
        const items = this.state.sourceController.getItems();

        if (this._columnsPosition === undefined) {
            let initialPosition = columnsNavigation.sourceConfig.position;

            if (this._getColumnsNavigationMode() === 'limited') {
                initialPosition = this._moveColumnsPosition(
                    initialPosition,
                    direction,
                    Math.floor(columnsNavigation.sourceConfig.limit / 2)
                );
            }

            this._columnsPosition = this._initColumnsPosition(initialPosition);
        }

        const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(this.state, direction);
        const requestColumnsFilter = cClone(dynamicColumnsFilter);
        if (this._filterStack?.length) {
            const filterIndex = Math.max(0, this._filterStack.length - MAX_FILTER_JOIN + 1);
            // При вызове повторной подгрузки в том же направлении до окончания первого вызова,
            // для следующего запроса, нужно запросить данные включая данные по предыдущему запросу.
            // В противном случае, запрос будет отменен и данные потеряются.
            // Таким образом, объединяем максимум - до трех последних запросов - чтобы иметь данные
            // на весь отображаемый период и не ждать лишнего.
            if (this._filterStack[filterIndex].direction === requestColumnsFilter.direction) {
                requestColumnsFilter.position = this._filterStack[filterIndex].position;
                requestColumnsFilter.limit *= 1 + this._filterStack.length - filterIndex;
                this._filterStack.push(dynamicColumnsFilter);
            } else {
                this._filterStack = [dynamicColumnsFilter];
            }
        } else {
            this._filterStack = [dynamicColumnsFilter];
        }

        const preparedFilter = {
            ...filter,
            [dynamicColumnsDataProperty]:
                this._convertDynamicColumnsFilterToRecord(requestColumnsFilter),
        };

        const navigation = prepareLoadColumnsNavigation(items, verticalNavigationConfig);

        if (this._getColumnsNavigationMode() === 'infinity') {
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
                columnsNavigationMode: this._getColumnsNavigationMode(),
                dynamicColumnsDataProperty,
                dynamicColumnsFilter: {
                    ...dynamicColumnsFilter,
                    position: this._columnsPosition,
                    limit,
                },
                items: null,
            });

            unstable_batchedUpdates(() => {
                this.setState({
                    columnsDataVersion: this.state.columnsDataVersion + 1,
                    dynamicColumnsGridData,
                });
            });
        }

        this.load('forward', undefined, preparedFilter, false, navigation)
            .then((loadedItems: RecordSet) => {
                this._filterStack = [];
                unstable_batchedUpdates(() => {
                    // Генерируем новые колонки после загрузки при соответствующим режиме.
                    // Для сдвига используется количество загруженных колонок.
                    if (this._getColumnsNavigationMode() === 'limited') {
                        // Значение берется из записи, которая посредине загруженных динамических данных
                        if (loadedItems.getCount()) {
                            const dynamicColumnsData = loadedItems
                                .at(0)
                                .get(dynamicColumnsDataProperty);
                            if (dynamicColumnsData && dynamicColumnsData.getCount()) {
                                this._columnsPosition = dynamicColumnsData
                                    .at(Math.floor(dynamicColumnsData.getCount() / 2))
                                    .getKey();
                            }
                        }

                        const dynamicColumnsGridData = this._generateDynamicColumnsData({
                            columnsNavigationMode: this._getColumnsNavigationMode(),
                            dynamicColumnsDataProperty,
                            dynamicColumnsFilter: null,
                            items: loadedItems,
                        });

                        this.setState({
                            columnsDataVersion: this.state.columnsDataVersion + 1,
                            dynamicColumnsGridData,
                        });
                    }

                    this._applyLoadedItemsToHorizontalDirection(
                        loadedItems,
                        direction,
                        this.state.dynamicColumnsGridData
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
        const items = this.state.sourceController.getItems();
        applyLoadedItems({
            items,
            loadedItems,
            columnsDataProperty: field,
            dynamicColumnsGridData,
            direction,
        });

        const metaData = items.getMetaData();
        const loadedMetaData = loadedItems.getMetaData();
        if (metaData && loadedMetaData) {
            if (this._getColumnsNavigationMode() === 'limited') {
                items.setMetaData({
                    ...metaData,
                    [META_DATA_COLUMNS_MORE_FIELD]: loadedMetaData[META_DATA_COLUMNS_MORE_FIELD],
                });
            }
        }
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
            dynamicColumnsDataProperty: field,
            columnsNavigationMode: this._getColumnsNavigationMode(),
            items,
        });

        return super._dataLoaded(items, direction, nextState);
    }

    private _hasMoreColumns(direction: TNavigationDirection): boolean {
        const meta = this.state.items?.getMetaData();
        if (meta) {
            const columnsMore = meta[META_DATA_COLUMNS_MORE_FIELD];
            return columnsMore && columnsMore[direction];
        }
        return true;
    }

    loadBackwardColumns() {
        if (this.state.columnsNavigation.sourceConfig.direction !== 'forward') {
            if (
                this._getColumnsNavigationMode() === 'infinity' ||
                this._hasMoreColumns('backward')
            ) {
                this._loadColumns('backward');
            }
        }
    }

    loadForwardColumns() {
        if (this._getColumnsNavigationMode() === 'infinity' || this._hasMoreColumns('forward')) {
            this._loadColumns('forward');
        }
    }

    private _getColumnsNavigationMode(): TColumnsNavigationMode {
        return 'limited';
    }
}
