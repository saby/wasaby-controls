/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
 */
import * as React from 'react';
import { object } from 'Types/util';
import {
    IDynamicGridSliceState,
    IDynamicSliceGenerateDynamicColumnsData,
    DynamicGridSlice,
} from 'Controls-Lists/dynamicGrid';
import { isEqual } from 'Types/object';
import { TNavigationDirection } from 'Controls/interface';

import { format as EntityFormat, Model, Record as EntityRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import {
    IRange,
    ITimelineColumnsFilter,
    ITimelineGridDataFactoryArguments,
    ITimelineGridLoadResult,
    TAggregationVisibility,
} from './ITimelineGridDataFactoryArguments';
import { generateDynamicColumnsData } from './DynamicColumnsGridDataGenerator';
import {
    getNextQuantum,
    getQuantum,
    getRangeSize,
    Quantum,
    shiftDate,
    IQuantum,
    TScaleDirection,
} from 'Controls-Lists/_timelineGrid/utils';
import {
    prepareDynamicColumnsFilterRecord,
    prepareDynamicColumnsFilter,
    correctDateFromServerToClient,
    resetDateToStart,
} from 'Controls-Lists/_timelineGrid/factory/utils';
import {
    RangeHistoryUtils,
    TQuantumScaleMap,
} from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
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
    quantums: IQuantum[];
    rangeHistoryId?: string;
    /**
     * Видимость дополнительной колонки.
     */
    aggregationVisibility?: TAggregationVisibility;
    eventsProperty?: string;
    eventStartProperty?: string;
    eventEndProperty?: string;
    // коэффициент объединения квантов
    quantumScale?: number;
}

export interface ITimelineContextData {
    quantum: Quantum;
    dynamicColumnsGridData: Date[];
    range: IRange;
}

export const TimelineDataContext = React.createContext<ITimelineContextData>(null);

export interface ITimelineSliceGenerateDynamicColumnsData
    extends IDynamicSliceGenerateDynamicColumnsData {
    dynamicColumnsFilter: ITimelineColumnsFilter;
}

/*
 * Кванты, доступные по умолчанию, Когда не задана опция dataFactoryArguments.quantums
 */
export const defaultQuantums: IQuantum[] = [
    { name: Quantum.Hour },
    { name: Quantum.Day },
    { name: Quantum.Month },
];

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
    private _loadedRange: IRange;
    // Соотвтветствие кванта и масштаба, в котором он должен отобразиться.
    private _quantumScaleMap: TQuantumScaleMap;
    // Список квантов для фильтра. Задан не на стейте, чтобы не пробрасывать в dynamicGrid
    private _quantums?: IQuantum[];
    private _canLoadColumns: boolean;

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
        return generateDynamicColumnsData({
            ...props.dynamicColumnsFilter,
            quantums: this._quantums,
        });
    }

    protected _prepareDynamicColumnsFilter(
        state: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>,
        direction: TNavigationDirection
    ): ITimelineColumnsFilter<TColumnsNavigationPosition> {
        const quantumScale = state.quantumScale;
        const dynamicColumnsGridData = state.dynamicColumnsGridData;
        const quantums = state.quantums;
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
            startPositionToBackward,
            quantums,
            quantumScale
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
        const filterObject = super._convertDynamicColumnsFilterRecordToObject(filter);
        filterObject.position = correctDateFromServerToClient(filterObject.position);
        return {
            ...filterObject,
            quantum: filter.get('quantum'),
            scale: filter.get('scale'),
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
        const quantumScale = this.state.quantumScale;
        const quantum = getQuantum(this.state.range, this.state.quantums, quantumScale);
        shiftDate(result, direction, quantum, shiftSize * quantumScale);
        return result as TColumnsNavigationPosition;
    }

    protected _dataLoaded(
        loadedItems: RecordSet,
        direction: TNavigationDirection,
        nextState: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
    ): Partial<IDynamicGridSliceState> | Promise<Partial<IDynamicGridSliceState>> {
        const items = this.state.sourceController.getItems();
        const loadedMetaData = loadedItems.getMetaData();
        if (items) {
            items.setMetaData(loadedMetaData);
        }
        this._loadedRange = nextState.range;

        return super._dataLoaded(loadedItems, direction, nextState);
    }

    getLoadedRange(): IRange {
        return this._loadedRange;
    }

    protected _initState(
        loadResult: ITimelineGridLoadResult,
        config: ITimelineGridDataFactoryArguments
    ): ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData> {
        if (loadResult.range) {
            config.range = loadResult.range;
        }
        this._loadedRange = config.range;
        this._canLoadColumns = true;
        const loadRange = config.range;

        const quantums = config.quantums || loadResult.quantums || defaultQuantums;
        this._quantumScaleMap = loadResult.quantumScaleMap;
        const { quantum, scale } = this._getQuantumWithScale(config.range, quantums, 1);
        this._quantums = object.clone(quantums);
        return {
            // todo loadRange, quantumScale тут не должен быть
            ...super._initState(loadResult, {
                ...config,
                loadRange,
                quantumScale: scale,
            }),
            range: config.range,
            visibleRange: config.range,
            loadRange,
            rangeHistoryId: config.rangeHistoryId,
            quantum,
            quantums,
            quantumScale: scale,
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
        nextState.quantum = getQuantum(nextState.range, nextState.quantums, nextState.quantumScale);

        if (
            this.state.quantum !== nextState.quantum &&
            Object.keys(nextState.selectedCells).length
        ) {
            nextState.selectedCells = {};
        }

        if (nextState.range !== this.state.range) {
            RangeHistoryUtils.store(
                nextState.rangeHistoryId,
                nextState.range,
                this._quantumScaleMap
            );

            if (nextState.loadRange !== this.state.loadRange) {
                const { field } = nextState.columnsNavigation.sourceConfig;

                const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(
                    nextState,
                    'bothways'
                );
                const filterRecord =
                    this._convertDynamicColumnsFilterToRecord(dynamicColumnsFilter);
                this._columnsPosition = dynamicColumnsFilter.position;
                // Если не фильтр равен старому, можно не ждать перезагрузку, ее не будет
                if (isEqual(nextState.filter.dynamicColumnsData, filterRecord)) {
                    this._loadedRange = nextState.range;
                } else {
                    nextState.filter = {
                        ...nextState.filter,
                        [field]: filterRecord,
                    };
                }
            }
        } else if (nextState.range !== this._loadedRange) {
            return this.reload(undefined, true).then(() => {
                return super._beforeApplyState(nextState);
            });
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

    /**
     * Возвращает квант и его масштаб.
     * Например, основной квант может быть "час", но из-за масштаба - "минута"
     * @param range Диапазон, для которого определяется квант
     * @param quantums Доступные кванты
     * @param defaultScale Масштаб по умолчанию
     */
    private _getQuantumWithScale(
        range: IRange,
        quantums?: IQuantum[],
        defaultScale?: number
    ): { quantum?: Quantum; scale?: number } {
        // Берём квант по диапазону
        const quantum = getQuantum(range, quantums);
        // Берём следующий в глубину квант
        const nextQuantum = getNextQuantum(quantum, quantums, 'increase');
        // Ищем сохранённые или переданные прикладником масштабы в мапе
        // Если нашли - то применяем более глубокий квани и его масштаб.
        if (nextQuantum && this._quantumScaleMap?.[nextQuantum]) {
            return {
                quantum: nextQuantum,
                scale: this._quantumScaleMap[nextQuantum],
            };
        }
        return { quantum, scale: defaultScale };
    }

    /**
     * Меняет текущий quantum и scale. делает перезапрос.
     * @param quantumScale
     * @param quantum
     * @param direction
     */
    setQuantumScale(quantumScale: number, quantum: Quantum, direction: TScaleDirection): void {
        // Достаём квант в глубину
        const nextQuantum = getNextQuantum(quantum, this._quantums, 'increase');
        // Находим текущий масштаб с учётом того,
        // что могли сменить квант из-за выхода в высоту
        const mapIndex = nextQuantum && nextQuantum === this.state.quantum ? nextQuantum : quantum;
        // Сохраняем масштаб, соответствующий кванту
        this._quantumScaleMap[mapIndex] = quantumScale;
        // Нужно учитывать, что мы не должны запрашивать часы с 10:30 до 11:30,
        // или получасия с 10:45 до 11:15, поэтому нужно делать корректировку диапазона в соответствии с масштабом.
        const startDate = this.visibleRange.start;
        if (direction === 'decrease') {
            resetDateToStart(startDate, quantum, quantumScale);
        }
        const endDate = new Date(startDate.getTime());
        // В фильтре остаётся тот же 12, т.к. у нас остаётся то же число колонок.
        // Но Range при этом должен измениться. От старта видимого диапазона,
        // по шагу масштаба, например 12 раз по 30 минут.
        const rangeSize = getRangeSize(this.visibleRange, quantum);
        shiftDate(endDate, 'forward', quantum, rangeSize * quantumScale);
        const range = {
            start: startDate,
            end: endDate,
        };
        this.setState({
            quantumScale,
            quantum,
            range,
            loadRange: range,
            visibleRange: range,
        });
    }

    /*
     * Устанавливает диапазон, по которому строится таймлайн таблица
     * @param newRange
     * @param quantumScale параметр, на основе которогоопределяется масштаб кванта.
     */
    setRange(newRange: IRange, quantumScale?: number): void {
        const { quantum, scale } = this._getQuantumWithScale(
            newRange,
            this.state.quantums,
            quantumScale || this.state.quantumScale
        );
        let endDate = newRange.end;
        if (
            quantum !== Quantum.Hour &&
            quantum !== Quantum.Minute &&
            quantum !== Quantum.Second &&
            this.state.availableRanges
        ) {
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
            (this._loadedRange.start.getTime() === range.start.getTime() &&
                this._loadedRange.end.getTime() === range.end.getTime())
        ) {
            return;
        }

        this.setState({
            visibleRange: range,
            quantumScale: scale,
            quantum,
        });
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

    setCanLoadColumns(canLoadColumns: boolean): void {
        this._canLoadColumns = canLoadColumns;
    }

    protected _loadColumns(direction: Exclude<TNavigationDirection, 'bothways'>): void {
        if (!this._canLoadColumns) {
            return;
        }
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

/**
 * Контекст Таймлайн таблицы. Экземпляр нативного ReactContext.
 * @class Controls-Lists/_timelineGrid/factory/Slice/TimelineDataContext
 * @public
 * @remark
 * Значения содержат:
 * - quantum {@link Controls-Lists/timelineGrid/Quantum.typedef Quantum} Квант периода
 * - eventsSaturation {@link Controls-Lists/timelineGrid/TEventSaturation.typedef TEventSaturation} Насыщенность событий
 * - columnDataDensity {@link Controls-Lists/dynamicGrid/TColumnDataDensity.typedef TColumnDataDensity} Плотность отображения данных
 * - columnWidth Number Ширина колонок
 * - dynamicColumnsGridData RecordSet Данные динамических колонок
 * - range {@link Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} Текущий выбранный период
 * - visibleRange {@link Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} Отображаемый период
 */
