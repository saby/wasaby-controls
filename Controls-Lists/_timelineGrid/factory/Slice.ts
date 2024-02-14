/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
 */
import * as React from 'react';
import { IListLoadResult } from 'Controls/dataFactory';
import {
    IDynamicSliceGenerateDynamicColumnsData,
    IDynamicGridSliceState,
    DynamicGridSlice,
} from 'Controls-Lists/dynamicGrid';
import { isEqual } from 'Types/object';
import { TNavigationDirection} from 'Controls/interface';

import { format as EntityFormat, Model, Record as EntityRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import {
    IRange,
    TAggregationVisibility,
    ITimelineColumnsFilter,
    ITimelineGridDataFactoryArguments,
} from './ITimelineGridDataFactoryArguments';
import { generateDynamicColumnsData } from './DynamicColumnsGridDataGenerator';
import { Quantum, getQuantum, shiftDate } from 'Controls-Lists/_timelineGrid/utils';
import {
    prepareDynamicColumnsFilterRecord,
    prepareDynamicColumnsFilter,
} from 'Controls-Lists/_timelineGrid/factory/utils';
import { RangeHistoryUtils } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
import type { IHolidaysConfig } from 'Controls-Lists/_timelineGrid/render/Holidays';
import { TColumnsNavigationMode } from 'Controls-Lists/_dynamicGrid/factory/IDynamicGridDataFactoryArguments';

/**
 * Состояние слайса Таймлайн-таблицы.
 * @interface Controls-Lists/_timelineGrid/factory/Slice/ITimelineGridSliceState
 * @public
 */
export interface ITimelineGridSliceState<TNavigationPosition = Date, TColumnsGridData = Date>
    extends IDynamicGridSliceState<TNavigationPosition, TColumnsGridData> {
    range: IRange;
    /**
     * Отображаемый период
     */
    visibleRange: IRange;
    loadRange: IRange;
    /**
     * Конфигурация для работы с календарём праздников
     */
    holidaysConfig: IHolidaysConfig;
    availableRanges?: Record<string, number[]>;
    /**
     * Текущий квант динамических данных
     */
    quantum: Quantum;
    rangeHistoryId?: string;
    /**
     * Видимость дополнительной колонки.
     */
    aggregationVisibility?: TAggregationVisibility;
    eventsProperty?: string;
    eventStartProperty?: string;
    eventEndProperty?: string;
}

export interface ITimelineContextData {
    quantum: Quantum;
    dynamicColumnsGridData: Date[];
    range: IRange;
}

/**
 * Экземпляр нативного ReactContext.
 * Значения содержат
 * * quantum {@link Controls-Lists/timelineGrid/Quantum.typedef Quantum} Квант периода
 * * eventsSaturation {@link Controls-Lists/timelineGrid/TEventSaturation.typedef TEventSaturation} Насыщенность событий
 * * columnDataDensity {@link Controls-Lists/dynamicGrid/TColumnDataDensity.typedef TColumnDataDensity} Плотность отображения данных
 * * columnWidth Number Ширина колонок
 * * dynamicColumnsGridData ReordSet Данные динамических колонок
 * * range {@link Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} Текущий выбранный период
 * * visibleRange {@link Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} Отображаемый период
 */
export const TimelineDataContext = React.createContext<ITimelineContextData>(null);

export interface ITimelineSliceGenerateDynamicColumnsData
    extends IDynamicSliceGenerateDynamicColumnsData {
    dynamicColumnsFilter: ITimelineColumnsFilter;
}

/**
 * Слайс "Таймлайн таблицы".
 * Настраивается в соответствии с параметрами {@link Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments ITimelineGridDataFactoryArguments}
 * Хранит состояние списка в формате {@link Controls-Lists/_timelineGrid/factory/Slice/ITimelineGridSliceState ITimelineGridSliceState}
 * @class Controls-Lists/_timelineGrid/factory/Slice/TimelineGridSlice
 * @public
 */
export default class TimelineGridSlice<
    TColumnsNavigationPosition = Date,
    TColumnsGridData = Date
> extends DynamicGridSlice<TColumnsNavigationPosition, TColumnsGridData> {
    state: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;

    get range(): IRange {
        return this.state.range;
    }

    get visibleRange(): IRange {
        return this.state.visibleRange;
    }

    get availableRanges(): Record<string, number[]> {
        return this.state.availableRanges;
    }

    get loadRange(): IRange {
        return this.state.loadRange;
    }

    protected _generateDynamicColumnsData(props: ITimelineSliceGenerateDynamicColumnsData) {
        return generateDynamicColumnsData(props.dynamicColumnsFilter);
    }

    protected _prepareDynamicColumnsFilter(
        state: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>,
        direction: TNavigationDirection
    ): ITimelineColumnsFilter<TColumnsNavigationPosition> {
        const dynamicColumnsGridData = state.dynamicColumnsGridData;
        const startPositionToForward =
            direction === 'forward' &&
            (dynamicColumnsGridData[
                dynamicColumnsGridData.length - 1
            ] as unknown as TColumnsNavigationPosition);
        const startPositionToBackward =
            direction === 'backward' &&
            (dynamicColumnsGridData[0] as unknown as TColumnsNavigationPosition);

        return prepareDynamicColumnsFilter(
            state.loadRange,
            direction,
            startPositionToForward,
            startPositionToBackward
        );
    }

    protected _convertDynamicColumnsFilterToRecord(
        dynamicColumnsFilter: ITimelineColumnsFilter<TColumnsNavigationPosition>
    ): EntityRecord {
        return prepareDynamicColumnsFilterRecord(
            dynamicColumnsFilter,
            this.state.source.getAdapter(),
            EntityFormat.DateTimeField
        );
    }

    protected _convertDynamicColumnsFilterRecordToObject(
        filter: Model
    ): ITimelineColumnsFilter<TColumnsNavigationPosition> {
        return {
            ...super._convertDynamicColumnsFilterRecordToObject(filter),
            quantum: filter.get('quantum'),
        };
    }

    protected _initColumnsPosition(
        position: TColumnsNavigationPosition
    ): TColumnsNavigationPosition {
        const initialDate = this.state.dynamicColumnsGridData[0] as unknown as Date;
        return new Date(initialDate) as unknown as TColumnsNavigationPosition;
    }

    protected _moveColumnsPosition(
        position: TColumnsNavigationPosition,
        direction: Exclude<TNavigationDirection, 'bothways'>,
        shiftSize: number
    ): TColumnsNavigationPosition {
        const result = new Date(position as Date);
        const quantum = getQuantum(this.state.range);
        shiftDate(result, direction, quantum, shiftSize);
        return result as TColumnsNavigationPosition;
    }

    protected _dataLoaded(
        loadedItems: RecordSet,
        direction: TNavigationDirection,
        nextState: IDynamicGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
    ): Partial<IDynamicGridSliceState> | Promise<Partial<IDynamicGridSliceState>> {
        const items = this.state.sourceController.getItems();
        const loadedMetaData = loadedItems.getMetaData();
        items.setMetaData(loadedMetaData);

        return super._dataLoaded(loadedItems, direction, nextState);
    }

    protected _initState(
        loadResult: IListLoadResult,
        config: ITimelineGridDataFactoryArguments
    ): ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData> {
        if (loadResult.range) {
            config.range = loadResult.range;
        }
        const quantum = getQuantum(config.range);
        const loadRange = config.range;

        return {
            // todo loadRange тут не должен быть
            ...super._initState(loadResult, {
                ...config,
                loadRange,
            }),
            range: config.range,
            visibleRange: config.range,
            loadRange,
            rangeHistoryId: config.rangeHistoryId,
            quantum,
            holidaysConfig: config.holidaysConfig,
            aggregationVisibility: config.aggregationVisibility || 'hidden',
            eventsProperty: config.eventsProperty,
            eventStartProperty: config.eventStartProperty,
            eventEndProperty: config.eventEndProperty,
        } as unknown as ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;
    }

    protected _beforeApplyState(
        nextState: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
    ):
        | ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
        | Promise<ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>> {
        nextState.quantum = getQuantum(nextState.range);

        if (
            this.state.quantum !== nextState.quantum &&
            Object.keys(nextState.selectedCells).length
        ) {
            nextState.selectedCells = {};
        }

        if (nextState.range !== this.state.range) {
            RangeHistoryUtils.store(nextState.rangeHistoryId, nextState.range);

            if (nextState.loadRange !== this.state.loadRange) {
                const { field } = nextState.columnsNavigation.sourceConfig;

                const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(
                    nextState,
                    'bothways'
                );
                this._columnsPosition = dynamicColumnsFilter.position;

                nextState.filter = {
                    ...nextState.filter,
                    [field]: this._convertDynamicColumnsFilterToRecord(dynamicColumnsFilter),
                };
            }
        }

        return super._beforeApplyState(nextState) as unknown as ITimelineGridSliceState<
            TColumnsNavigationPosition,
            TColumnsGridData
        >;
    }

    protected _needRejectBeforeApply(
        partialState: Partial<
            ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
        >,
        currentAppliedState?: Partial<
            ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
        >
    ): boolean {
        const props = ['range'];
        const isPropertyChanged = (propName) => {
            return (
                partialState.hasOwnProperty(propName) &&
                !isEqual(partialState[propName], this.state[propName]) &&
                // Если уже применяется state c таким же значением, то не надо прерывать обновление
                (!currentAppliedState ||
                    !isEqual(partialState[propName], currentAppliedState[propName]))
            );
        };
        return (
            !!props.find((propName) => isPropertyChanged(propName)) ||
            super._needRejectBeforeApply(partialState, currentAppliedState)
        );
    }

    setRange(newRange: IRange): void {
        const quantum = getQuantum(newRange);
        let endDate = newRange.end;
        if (quantum !== 'hour' && this.state.availableRanges) {
            const maxRange =
                this.state.availableRanges[quantum + 's'][
                    this.state.availableRanges[quantum + 's'].length - 1
                ];
            const maxEndDate = new Date(newRange.start);
            shiftDate(maxEndDate, 'forward', quantum, maxRange - 1);
            if (quantum === 'month') {
                maxEndDate.setMonth(maxEndDate.getMonth() + 1);
                maxEndDate.setDate(0);
            }
            endDate = endDate > maxEndDate ? maxEndDate : endDate;
        }
        const range = {
            start: newRange.start,
            end: endDate,
            needScroll: newRange.needScroll,
        };

        if (
            !range.start ||
            !range.end ||
            (this.state.range.start.getTime() === range.start.getTime() &&
                this.state.range.end.getTime() === range.end.getTime())
        ) {
            return;
        }

        this.setState({ visibleRange: range });
        this.setState({
            range,
            loadRange: range,
        });
    }

    setAvailableRanges(availableRanges: Record<string, number[]>): void {
        if (isEqual(availableRanges, this.state.availableRanges)) {
            return;
        }
        this.setState({ availableRanges });
    }

    protected _loadColumns(direction: Exclude<TNavigationDirection, 'bothways'>): void {
        const columnsNavigation = this.state.columnsNavigation;
        const dynamicColumnsDataProperty = columnsNavigation.sourceConfig.field;
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

        if (this._getColumnsNavigationMode() === 'infinity') {
            this._columnsPosition = this._moveColumnsPosition(
                this._columnsPosition,
                direction,
                dynamicColumnsFilter.limit
            );

            const dynamicColumnsGridData = this._generateDynamicColumnsData({
                columnsNavigationMode: this._getColumnsNavigationMode(),
                dynamicColumnsDataProperty,
                dynamicColumnsFilter: {
                    ...dynamicColumnsFilter,
                    position: this._columnsPosition,
                    limit: dynamicColumnsFilter.limit,
                },
                items: null,
            });

            this.setState({
                visibleRange: {
                    start: dynamicColumnsGridData[Math.floor(dynamicColumnsGridData.length / 3)],
                    end: dynamicColumnsGridData[Math.floor(dynamicColumnsGridData.length / 3) * 2],
                },
                columnsDataVersion: this.state.columnsDataVersion + 1,
                dynamicColumnsGridData,
            });
        }
    }

    private _getColumnsNavigationMode(): TColumnsNavigationMode {
        return 'infinity';
    }
}
