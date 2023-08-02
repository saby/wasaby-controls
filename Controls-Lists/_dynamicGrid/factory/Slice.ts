import { RecordSet } from 'Types/collection';

import { IListState, IListLoadResult, List } from 'Controls/dataFactory';
import { format as EntityFormat, Record as EntityRecord } from 'Types/entity';
import {
    IDynamicGridDataFactoryArguments,
    IDynamicColumnsNavigation,
    IDynamicColumnsFilter,
} from './IDynamicGridFactory';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    applyColumnsData,
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
import { TPlainSelection } from '../selection/interfaces';
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
    selectedCells: TPlainSelection;
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

    protected _generateDynamicColumnsGridDataByColumnsNavigation(
        columnsNavigation: IDynamicColumnsNavigation<TColumnsNavigationPosition>
    ) {
        const dynamicColumnsFilter = {
            direction: columnsNavigation.sourceConfig.direction,
            limit: columnsNavigation.sourceConfig.limit,
            position: columnsNavigation.sourceConfig.position,
        };

        return this._generateDynamicColumnsData({
            dynamicColumnsFilter,
        });
    }

    protected _generateDynamicColumnsGridDataAfterReload(
        nextState: IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
    ) {
        const { field } = nextState.columnsNavigation.sourceConfig;

        const dynamicFilter = nextState.filter[field];
        if (dynamicFilter.get('direction') === 'bothways') {
            const dynamicColumnsFilter = {
                position: dynamicFilter.get('position'),
                direction: dynamicFilter.get('direction'),
                limit: dynamicFilter.get('limit'),
            };
            nextState.dynamicColumnsGridData = this._generateDynamicColumnsData({
                dynamicColumnsFilter,
            });
        }
    }

    protected _initState(
        loadResult: IListLoadResult,
        config: IDynamicGridDataFactoryArguments<TColumnsNavigationPosition>
    ): IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData> {
        const dynamicColumnsGridData = this._generateDynamicColumnsGridDataByColumnsNavigation(
            config.columnsNavigation
        );

        return {
            ...super._initState(loadResult, config),
            staticColumns: config.staticColumns,
            dynamicColumn: config.dynamicColumn,
            staticHeaders: config.staticHeaders,
            dynamicHeader: config.dynamicHeader,
            columnsNavigation: config.columnsNavigation,
            columnsDataVersion: 0,
            dynamicColumnsGridData,
            selectedCells: {},
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

        const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(
            this.state,
            this._columnsPosition,
            direction
        );

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

        unstable_batchedUpdates(() => {
            const dynamicColumnsGridData = this._generateDynamicColumnsData({
                dynamicColumnsFilter: {
                    ...dynamicColumnsFilter,
                    position: this._columnsPosition,
                    limit: dynamicColumnsFilter.limit * NAVIGATION_LIMIT_FACTOR,
                },
            });

            this._columnsPosition = this._moveColumnsPosition(
                this._columnsPosition,
                direction,
                dynamicColumnsFilter.limit
            );

            this.setState({
                columnsDataVersion: this.state.columnsDataVersion + 1,
                dynamicColumnsGridData,
            });
        });

        this.load('forward', undefined, preparedFilter, false, navigation).then(
            (loadedColumnsData) => {
                unstable_batchedUpdates(() => {
                    applyColumnsData({
                        items: this.state.sourceController.getItems(),
                        columnsData: loadedColumnsData,
                        columnsDataProperty: dynamicColumnsDataProperty,
                    });
                });
            }
        );
    }

    protected _prepareDynamicColumnsFilter(
        state: IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>,
        actualPosition: TColumnsNavigationPosition,
        actualDirection: TNavigationDirection
    ): IDynamicColumnsFilter<TColumnsNavigationPosition> {
        const columnsNavigation = state.columnsNavigation;
        return prepareDynamicColumnsFilter({
            columnsNavigation,
            actualPosition,
            actualDirection,
        });
    }

    protected _convertDynamicColumnsFilterToRecord(
        dynamicColumnsFilter: IDynamicColumnsFilter<TColumnsNavigationPosition>
    ): EntityRecord {
        return prepareDynamicColumnsFilterRecord(
            dynamicColumnsFilter,
            this.state.source.getAdapter(),
            EntityFormat.IntegerField
        );
    }

    protected _beforeApplyState(
        nextState: IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
    ):
        | IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
        | Promise<IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>> {
        // При смене корня формируем фильтр запроса данных для динамических колонок.
        if (nextState.root !== this.state.root) {
            const { field } = nextState.columnsNavigation.sourceConfig;

            const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(
                nextState,
                this._columnsPosition,
                'bothways'
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
        this._generateDynamicColumnsGridDataAfterReload(nextState);
        return super._dataLoaded(items, direction, nextState);
    }

    loadBackwardColumns() {
        this._loadColumns('backward');
    }

    loadForwardColumns() {
        this._loadColumns('forward');
    }
}
