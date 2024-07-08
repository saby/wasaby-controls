/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { RecordSet } from 'Types/collection';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { IListLoadResult, IListState, List } from 'Controls/dataFactory';
import { format as EntityFormat, Model, Record as EntityRecord } from 'Types/entity';
import {
    IDynamicColumnsFilter,
    IDynamicColumnsNavigation,
    IDynamicGridDataFactoryArguments,
    TColumnsNavigationMode,
} from './IDynamicGridDataFactoryArguments';
import { IColumnConfig, IFooterConfig, IHeaderConfig } from 'Controls/gridReact';
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
    generateDynamicColumnsDataByItems,
} from './DynamicColumnsGridDataGenerator';
import {
    TSelectionMap,
    TCellsMultiSelectVisibility,
    TCellsMultiSelectAccessibilityCallback,
} from '../selection/shared/interface';
import { IDynamicColumnConfig } from 'Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent';

const META_DATA_COLUMNS_MORE_FIELD = 'columnsMore';

/**
 * Состояние слайса таблицы с загружаемыми колонками
 * @interface Controls-Lists/_dynamicGrid/factory/Slice/IDynamicGridSliceState
 * @template TNavigationPosition Тип курсора
 * @template TColumnsGridData Тип динамических данных
 * @public
 */
export interface IDynamicGridSliceState<TNavigationPosition = number, TColumnsGridData = number>
    extends IListState {
    staticColumns: IColumnConfig[];
    dynamicColumn: IDynamicColumnConfig<TColumnsGridData>;
    staticHeaders: IHeaderConfig[];
    dynamicHeader: IHeaderConfig;
    staticFooter?: IFooterConfig;
    dynamicFooter?: IFooterConfig[];
    /**
     * Конфигурация горизонтальной навигации
     */
    columnsNavigation: IDynamicColumnsNavigation<TNavigationPosition>;
    columnsDataVersion: number;
    /**
     * Данные для генерации динамических колонок
     * @field Controls-Lists/_dynamicGrid/factory/Slice/IDynamicGridSliceState#dynamicColumnsGridData
     * @cfg {Number}
     */
    dynamicColumnsGridData: TColumnsGridData[];
    /**
     * Видимость множественного выбора ячеек
     */
    cellsMultiSelectVisibility: TCellsMultiSelectVisibility;
    /**
     * Выбранные ячейки
     */
    selectedCells: TSelectionMap;
    /**
     * функция, возвращающая доступность чекбокса на конкретных ячейках
     */
    cellsMultiSelectAccessibilityCallback?: TCellsMultiSelectAccessibilityCallback;
    dynamicColumnsDataProperty?: string;
}

export interface IDynamicSliceGenerateDynamicColumnsData {
    dynamicColumnsFilter: IDynamicColumnsFilter<unknown>;
    items: RecordSet;
    dynamicColumnsDataProperty: string;
    columnsNavigationMode: TColumnsNavigationMode;
}

/**
 * Слайс "Таблицы с загружаемыми колонками".
 * Настраивается в соответствии с параметрами {@link Controls-Lists/_dynamicGrid/factory/IDynamicGridDataFactoryArguments IDynamicGridDataFactoryArguments}
 * Хранит состояние списка в формате {@link Controls-Lists/_dynamicGrid/factory/Slice/IDynamicGridSliceState IDynamicGridSliceState}
 * @class Controls-Lists/_dynamicGrid/factory/Slice/DynamicGridSlice
 * @public
 */
export default class DynamicGridSlice<
    TColumnsNavigationPosition = number,
    TColumnsGridData = number
> extends List.slice {
    protected _columnsPosition: TColumnsNavigationPosition;
    state: IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;

    protected _generateDynamicColumnsData(props: IDynamicSliceGenerateDynamicColumnsData) {
        const { columnsNavigationMode, dynamicColumnsDataProperty, dynamicColumnsFilter, items } =
            props;

        if (columnsNavigationMode === 'limited') {
            return generateDynamicColumnsDataByItems(items, dynamicColumnsDataProperty);
        } else {
            return generateDynamicColumnsData(dynamicColumnsFilter);
        }
    }

    protected _getDynamicColumnsDataGeneratorParams(state, items) {
        const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(
            state,
            state.columnsNavigation.sourceConfig.direction || 'bothways'
        );
        return {
            columnsNavigationMode: this._getColumnsNavigationMode(state),
            dynamicColumnsDataProperty: state.columnsNavigation.sourceConfig.field,
            dynamicColumnsFilter,
            items,
        };
    }

    protected _initState(
        loadResult: IListLoadResult,
        config: IDynamicGridDataFactoryArguments<TColumnsNavigationPosition>
    ): IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData> {
        const dynamicColumnsGridData = this._generateDynamicColumnsData(
            this._getDynamicColumnsDataGeneratorParams(config, loadResult.items)
        );

        return {
            ...super._initState(loadResult, {
                ...config,
                deepScrollLoad: true,
            }),
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
            dynamicColumnsDataProperty: config.columnsNavigation.sourceConfig.field,
        } as unknown as IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;
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

    protected _loadColumns(direction: Exclude<TNavigationDirection, 'bothways'>): void {
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

            if (this._getColumnsNavigationMode(this.state) === 'limited') {
                initialPosition = this._moveColumnsPosition(
                    initialPosition,
                    direction,
                    Math.floor(columnsNavigation.sourceConfig.limit / 2)
                );
            }

            this._columnsPosition = this._initColumnsPosition(initialPosition);
        }

        const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(this.state, direction);

        const preparedFilter = {
            ...filter,
            [dynamicColumnsDataProperty]:
                this._convertDynamicColumnsFilterToRecord(dynamicColumnsFilter),
        };

        const navigation = prepareLoadColumnsNavigation(items, verticalNavigationConfig);

        this.load('forward', undefined, preparedFilter, false, navigation)
            .then((loadedItems: RecordSet) => {
                unstable_batchedUpdates(() => {
                    // Генерируем новые колонки после загрузки при соответствующим режиме.
                    // Для сдвига используется количество загруженных колонок.
                    if (this._getColumnsNavigationMode(this.state) === 'limited') {
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

                        const dynamicColumnsGridData = this._generateDynamicColumnsData(
                            this._getDynamicColumnsDataGeneratorParams(this.state, loadedItems)
                        );

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
            if (this._getColumnsNavigationMode(this.state) === 'limited') {
                items.setMetaData({
                    ...metaData,
                    headers: loadedMetaData.headers,
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

        nextState.dynamicColumnsGridData = this._generateDynamicColumnsData(
            this._getDynamicColumnsDataGeneratorParams(nextState, items)
        );

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
                this._getColumnsNavigationMode(this.state) === 'infinity' ||
                this._hasMoreColumns('backward')
            ) {
                this._loadColumns('backward');
            }
        }
    }

    loadForwardColumns() {
        if (
            this._getColumnsNavigationMode(this.state) === 'infinity' ||
            this._hasMoreColumns('forward')
        ) {
            this._loadColumns('forward');
        }
    }

    protected _getColumnsNavigationMode(_?: IDynamicGridSliceState): TColumnsNavigationMode {
        return 'limited';
    }
}
