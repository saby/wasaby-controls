/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { object } from 'Types/util';
import {
    DynamicGridSlice,
    IDynamicGridSliceState,
    IDynamicSliceGenerateDynamicColumnsData,
    IRangeSlice,
    TColumnDataDensity,
} from 'Controls-Lists/dynamicGrid';
import { isEqual } from 'Types/object';
import { TNavigationDirection } from 'Controls/interface';

import { format as EntityFormat, Record as EntityRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import {
    IRange,
    ITimelineColumnsFilter,
    ITimelineColumnsNavigation,
    ITimelineGridDataFactoryArguments,
    ITimelineGridLoadResult,
    TAggregationVisibility,
} from './ITimelineGridDataFactoryArguments';
import {
    generateDynamicColumnsData,
    generateLimitedDynamicColumnsData,
} from './DynamicColumnsGridDataGenerator';
import {
    areQuantsInSameRangeGroup,
    correctDateFromClientToServer,
    correctDateFromServerToClient,
    DayRange,
    getQuantum,
    getRangeSize,
    IQuantum,
    isQuantumLessThanDay,
    Quantum,
    resetDateToStart,
    shiftDate,
    TEventSaturation,
    TQuantumRangeAccessibility,
    TScaleDirection,
    zoom,
} from 'Controls-Lists/_timelineGrid/utils';
import {
    convertQuantumFromFilter,
    prepareDynamicColumnsFilterRecord,
    prepareTimelineDynamicColumnsFilter,
} from 'Controls-Lists/_timelineGrid/factory/utils';
import {
    RangeHistoryUtils,
    TQuantsReplacementMap,
} from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
import type { IHolidaysConfig } from 'Controls-Lists/_timelineGrid/render/Holidays';
import { TColumnsNavigationMode } from 'Controls-Lists/_dynamicGrid/factory/IDynamicGridDataFactoryArguments';
import { constants } from 'Env/Env';

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
    // Соответствие кванта, которые выбрал пользователь кванту, определённому на основе Range.
    // Используется в случае, если в рамках одного и того же диапазона можно выбрать роазличные кванты.
    // Например Час - Полчаса - Четверть часа
    //      или Дни - Недели (пока не реализовано)
    // Пример:
    // На основе диапазона был определён квант "Час", но надо показать квант "Полчаса",
    // потому что пользователь при помощи кнопок масштабирования изменил "Час" на "Полчаса".
    quantsReplacementMap: TQuantsReplacementMap;
    rangeHistoryId?: string;
    /**
     * Видимость дополнительной колонки.
     */
    aggregationVisibility?: TAggregationVisibility;
    eventsProperty?: string;
    eventStartProperty?: string;
    eventEndProperty?: string;
    columnsNavigation: ITimelineColumnsNavigation;
    // Значение фильтра Скрыть выходные дни. Настраивается прикладником.
    filterHolidays?: boolean;
    // Флаг, позволяющий включить автоматический подскролл после смены диапазона. Компонент автоматически на основе переданных динамических событий решит, куда нужно проскроллить - к началу диапазона или к началу активности.
    needScroll?: boolean;
}

export interface ITimelineContextData {
    quantum: Quantum;
    dynamicColumnsGridData: Date[];
    range: IRange;
    visibleRange: IRange;
    columnWidth: number;
    columnDataDensity: TColumnDataDensity;
    eventsSaturation: TEventSaturation;
    containerRef: React.RefObject<HTMLElement | null>;
}

export const TimelineDataContext = React.createContext<ITimelineContextData>(null);

export interface ITimelineSliceGenerateDynamicColumnsData
    extends IDynamicSliceGenerateDynamicColumnsData {
    dynamicColumnsFilter: ITimelineColumnsFilter;
    rangeLimit?: IRange;
}

/*
 * Кванты, доступные по умолчанию, Когда не задана опция dataFactoryArguments.quantums
 */
export const defaultQuantums: IQuantum[] = [
    { name: Quantum.Hour },
    {
        name: Quantum.Day,
        scales: [
            {
                value: DayRange.Month,
                accessibility: 'all',
            },
            {
                value: DayRange.Week,
                accessibility: 'all',
            },
        ],
    },
    { name: Quantum.Month },
];

/**
 * Слайс "Таймлайн таблицы".
 * Настраивается в соответствии с параметрами {@link Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments ITimelineGridDataFactoryArguments}
 * Хранит состояние списка в формате {@link Controls-Lists/_timelineGrid/factory/Slice/ITimelineGridSliceState ITimelineGridSliceState}
 * @class Controls-Lists/_timelineGrid/factory/Slice/TimelineGridSlice
 * @extends Controls-Lists/dynamicGrid:DynamicGridSlice
 * @public
 */
export default class TimelineGridSlice<TColumnsNavigationPosition = Date, TColumnsGridData = Date>
    extends DynamicGridSlice<TColumnsNavigationPosition, TColumnsGridData>
    implements IRangeSlice
{
    state: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;
    private _loadedRange: IRange;
    // Список квантов для фильтра. Задан не на стейте, чтобы не пробрасывать в dynamicGrid
    private _quantums?: IQuantum[];
    private _canLoadColumns: boolean;
    // Индикатор для адаптива, что запустилась загрузка нового периода после изменения ширины вьюпорта
    private _loadingRangeByViewportWidthChanged?: boolean;

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

    protected _getDynamicColumnsDataGeneratorParams(
        state: ITimelineGridSliceState,
        items: RecordSet
    ): ITimelineSliceGenerateDynamicColumnsData {
        const superParams = super._getDynamicColumnsDataGeneratorParams(state, items);
        const quantum = convertQuantumFromFilter({
            quantum: superParams.dynamicColumnsFilter.quantum,
            scale: superParams.dynamicColumnsFilter.scale,
        });
        return { ...superParams, quantum, rangeLimit: state.columnsNavigation.sourceConfig.range };
    }

    protected _generateDynamicColumnsData(props: ITimelineSliceGenerateDynamicColumnsData) {
        const { dynamicColumnsFilter, rangeLimit } = props;

        if (rangeLimit) {
            return generateLimitedDynamicColumnsData({
                ...dynamicColumnsFilter,
                ...props,
                rangeLimit,
            });
        } else {
            return generateDynamicColumnsData({
                ...dynamicColumnsFilter,
                ...props,
            });
        }
    }

    protected _prepareDynamicColumnsFilter(
        state: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>,
        direction: TNavigationDirection
    ): ITimelineColumnsFilter<TColumnsNavigationPosition> {
        const dynamicColumnsGridData = state.dynamicColumnsGridData;
        const quantsReplacementMap = state.quantsReplacementMap;
        const startPositionToForward =
            direction === 'forward' &&
            (dynamicColumnsGridData[
                dynamicColumnsGridData.length - 1
            ] as unknown as TColumnsNavigationPosition);
        const startPositionToBackward =
            direction === 'backward' &&
            (dynamicColumnsGridData[0] as unknown as TColumnsNavigationPosition);

        return prepareTimelineDynamicColumnsFilter({
            range: state.loadRange,
            direction,
            startPositionToForward,
            startPositionToBackward,
            quantsReplacementMap,
        });
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
        const quantum = getQuantum(this.state.range, this.state.quantsReplacementMap);
        shiftDate(result, direction, quantum, shiftSize);
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
            // TODO Убрать needScroll из range https://online.sbis.ru/opendoc.html?guid=4201154a-ce23-49a2-ba2b-9966ea7cf19d&client=3
            if (nextState.needScroll || nextState.range.needScroll) {
                this._processRangeByLoadedData(loadedItems, nextState);
            }
        }
        this._loadedRange = nextState.range;
        nextState.keepNavigation = false;
        if (this._loadingRangeByViewportWidthChanged) {
            this.setLoadingRangeByViewportWidthChanged(false);
        }
        return super._dataLoaded(loadedItems, direction, nextState);
    }

    private _processRangeByLoadedData(items, nextState) {
        const quantumConfig = nextState.quantums.find((q) => q.name === nextState.quantum);
        if (quantumConfig && typeof quantumConfig.loadedRangeAdjustmentCallback === 'function') {
            const currentRange = {
                start: constants.isServerSide
                    ? correctDateFromClientToServer(nextState.range.start)
                    : new Date(nextState.range.start),
                end: constants.isServerSide
                    ? correctDateFromClientToServer(nextState.range.end)
                    : new Date(nextState.range.end),
            };
            let newRange = quantumConfig.loadedRangeAdjustmentCallback(items, currentRange);

            newRange = {
                start: constants.isServerSide
                    ? correctDateFromServerToClient(newRange.start)
                    : newRange.start,
                end: constants.isServerSide
                    ? correctDateFromServerToClient(newRange.end)
                    : newRange.end,
            };

            if (newRange && newRange.start < newRange.end) {
                nextState.range.start = newRange.start;
                nextState.range.end = newRange.end;
                nextState.visibleRange = nextState.range;
                const { field } = nextState.columnsNavigation.sourceConfig;
                nextState.filter[field].set('position', newRange.start);
                nextState.filter[field].set('limit', getRangeSize(newRange, nextState.quantum));
            }
        }
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
        if (loadResult.needScroll) {
            config.needScroll = loadResult.needScroll;
        }
        this._loadedRange = config.range;
        this._canLoadColumns = true;
        const loadRange = config.range;

        const quantums = config.quantums || defaultQuantums;
        const quantum = getQuantum(config.range, loadResult.quantsReplacementMap);
        this._quantums = object.clone(quantums);

        const state = {
            ...super._initState(loadResult, {
                ...config,
                loadRange,
            }),
            range: config.range,
            needScroll: config.needScroll,
            visibleRange: config.range,
            loadRange,
            rangeHistoryId: config.rangeHistoryId,
            quantum,
            quantums,
            quantsReplacementMap: loadResult.quantsReplacementMap,
            holidaysConfig: config.holidaysConfig,
            aggregationVisibility: config.aggregationVisibility || 'hidden',
            eventsProperty: config.eventsProperty,
            eventStartProperty: config.eventStartProperty,
            eventEndProperty: config.eventEndProperty,
        } as unknown as ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;
        if (loadResult.items) {
            this._processRangeByLoadedData(loadResult.items, state);
            state.dynamicColumnsGridData = this._generateDynamicColumnsData(
                this._getDynamicColumnsDataGeneratorParams(state, loadResult.items)
            );
        }
        return state;
    }

    protected _beforeApplyState(
        nextState: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
    ):
        | ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
        | Promise<ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>> {
        nextState.quantum = getQuantum(nextState.range, nextState.quantsReplacementMap);

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
                nextState.quantsReplacementMap,
                nextState.needScroll,
            );

            if (nextState.loadRange !== this.state.loadRange) {
                const { field } = nextState.columnsNavigation.sourceConfig;
                nextState.keepNavigation = true;
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
     * Устанавливает переданный {@link Controls-Lists/timelineGrid:Quantum квант}, сохраняет соответствие квантов в рамках одного {@link Controls-Lists/timelineGrid:IRange временного периода} в историю и делает перезапрос данных.
     * Используется тогда, когда необходимо поменять квант в рамках одного временного периода.
     * Например, в режиме дня у квантов hour, halfHour, quarterHour временной период один и тот же, и для их переключения необходимо вызывать slice.setQuantum().
     * @param quantum Новый квант
     * @param direction Направление масштабирования сетки Таймлайн-таблицы. Необходимо передавать для корректного сброса начала периода
     * @see setRange
     * @see zoomIn
     * @see zoomOut
     */
    setQuantum(quantum: Quantum, direction: TScaleDirection): void {
        // Сохраняем подмену кванта. Кодгда будем делать квант "Неделя", надо будет тут поменять условие
        const quantsReplacementMap = { ...this.state.quantsReplacementMap };
        if (areQuantsInSameRangeGroup(quantum, Quantum.Hour)) {
            quantsReplacementMap[Quantum.Hour] = quantum;
        }
        // Нужно учитывать, что мы не должны запрашивать часы с 10:30 до 11:30,
        // или получасия с 10:45 до 11:15, поэтому нужно делать корректировку диапазона в соответствии с масштабом.
        const startDate = this.visibleRange.start;
        if (direction === 'decrease') {
            resetDateToStart(startDate, quantum);
        }
        const endDate = new Date(startDate.getTime());
        // В фильтре остаётся тот же 12, т.к. у нас остаётся то же число колонок.
        // Но Range при этом должен измениться. От старта видимого диапазона,
        // по шагу масштаба, например 12 раз по 30 минут.
        const rangeSize = getRangeSize(this.visibleRange, quantum);
        // -1 тут добавлено, потому что для определения кванта используется строгое сравнение. см. getQuantum()
        shiftDate(endDate, 'forward', quantum, isQuantumLessThanDay(quantum) ? rangeSize - 1 : 0);
        const range = {
            start: startDate,
            end: endDate,
        };
        this.setState({
            quantum,
            range,
            loadRange: range,
            visibleRange: range,
            quantsReplacementMap,
        });
    }

    /**
     * Устанавливает {@link Controls-Lists/timelineGrid:IRange временной период}, по которому строится таймлайн таблица.
     * Используется, когда необходимо поменять {@link Controls-Lists/timelineGrid:IRange временной период} или {@link Controls-Lists/timelineGrid:Quantum квант},
     * кроме случаев, когда изменение кванта происходит в рамках одного временного преиода (см. {@link setQuantum}).
     * @param newRange Новый временной преиод
     * @param needScroll Флаг, позволяющий включить автоматический подскролл после текущей смены диапазона. Компонент автоматически на основе переданных динамических событий решит, куда нужно проскроллить - к началу диапазона или к началу активности.
     * @see setQuantum
     * @see zoomIn
     * @see zoomOut
     */
    setRange(newRange: IRange, needScroll?: boolean): void {
        const quantum = getQuantum(newRange, this.state.quantsReplacementMap);
        let endDate = newRange.end;
        if (
            quantum !== Quantum.Hour &&
            quantum !== Quantum.HalfHour &&
            quantum !== Quantum.QuarterHour &&
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
        const range: IRange = {
            start: newRange.start,
            end: endDate,
            needScroll,
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
            range,
            loadRange: range,
            visibleRange: range,
            quantum,
            needScroll
        });
    }

    /**
     * Последовательно увеличивает масштаб сетки Таймлайн-таблицы в соответствие с {@link Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#quantums Конфигурацией квантов}.
     * Сначала пытается переключить предустановленные {@link Controls-Lists/timelineGrid:IRange периоды}, затем меняет {@link Controls-Lists/timelineGrid:Quantum кванты} в рамках одного периода.
     * @param targetDate Дата, относительно которой происходит измененение масштаба. По умолчанию - начало видимого на таймлайне периода. Например, если в аргумент указать 13 января и происходит переход к часам, то будут показаны часы конкретного дня - 12 января.
     */
    zoomIn(targetDate: Date = this.state.visibleRange.start): void {
        this.zoom(targetDate, 'increase', 'zoom');
    }

    /**
     * Последовательно уменьшает масштаб сетки Таймлайн-таблицы в соответствие с {@link Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#quantums Конфигурацией квантов}.
     * Сначала пытается поменять {@link Controls-Lists/timelineGrid:Quantum квант} в рамках одного периода, а затем переключает {@link Controls-Lists/timelineGrid:IRange периоды}.
     * @param targetDate Дата, относительно которой происходит измененение масштаба. По умолчанию - начало видимого на таймлайне периода. Например, если таймлайн показывает часы 12 января, и происходит переход к неделе с
     */
    zoomOut(targetDate: Date = this.state.visibleRange.start): void {
        this.zoom(targetDate, 'decrease', 'zoom');
    }

    /*
     * Внутренний метод зума. Последовательно переключает периоды и кванты сетки Таймлайн-таблицы в указанном направлении масштабирования
     * @param targetDate Дата, относительно которой происходит измененение масштаба
     * @param scaleDirection Направление масштабирования сетки Таймлайн-таблицы. Необходимо передавать для корректного сброса начала периода
     * @param accessibility Доступность масштабов для переключения. (zoom - для кнопок масштабирования или header - для кликов по звголовку)
     */
    zoom(
        targetDate: Date,
        scaleDirection: TScaleDirection,
        accessibility: TQuantumRangeAccessibility
    ) {
        const { quantum: nextQuantum, range: nextRange, needScroll } = zoom({
            quantum: this.state.quantum,
            quantums: this.state.quantums,
            currentRange: this.state.range,
            targetDate,
            scaleDirection,
            accessibility,
        });
        if (nextQuantum && this.state.quantum !== nextQuantum) {
            // Если quantum поменялся, а range не поменялся, значит просто поменяли квант в одной группе пресетов
            this.setQuantum(nextQuantum, scaleDirection);
        } else {
            // В любом другом случае задаём диапазон
            this.setRange(nextRange, needScroll);
        }
    }

    setAvailableRanges(availableRanges: Record<string, number[]>): void {
        if (isEqual(availableRanges, this.state.availableRanges)) {
            return;
        }
        this.setState({ availableRanges });
    }

    applyAvailableRanges(availableRanges: Record<string, number[]>): void {
        this._applyState({ availableRanges });
    }

    setCanLoadColumns(canLoadColumns: boolean): void {
        this._canLoadColumns = canLoadColumns;
    }

    setLoadingRangeByViewportWidthChanged(loadingRangeByViewportWidthChanged: boolean) {
        this._loadingRangeByViewportWidthChanged = loadingRangeByViewportWidthChanged;
    }

    getLoadingRangeByViewportWidthChanged(): boolean | undefined {
        return this._loadingRangeByViewportWidthChanged;
    }

    protected _loadColumns(direction: Exclude<TNavigationDirection, 'bothways'>): void {
        if (!this._canLoadColumns) {
            return;
        }
        const columnsNavigation = this.state.columnsNavigation;
        const dynamicColumnsDataProperty = columnsNavigation.sourceConfig.field;
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

        if (this._getColumnsNavigationMode(this.state) === 'infinity') {
            this._columnsPosition = this._moveColumnsPosition(
                this._columnsPosition,
                direction,
                dynamicColumnsFilter.limit
            );

            const dynamicColumnsGridData = this._generateDynamicColumnsData({
                columnsNavigationMode: this._getColumnsNavigationMode(this.state),
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

    protected _getColumnsNavigationMode(state: ITimelineGridSliceState): TColumnsNavigationMode {
        return state.columnsNavigation.sourceConfig.range ? 'limited' : 'infinity';
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
