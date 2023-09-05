import { IListLoadResult } from 'Controls/dataFactory';
import {
    DynamicGridFactory,
    IDynamicGridDataFactoryArguments,
    IDynamicGridSliceState,
    NAVIGATION_LIMIT_FACTOR,
} from 'Controls-Lists/dynamicGrid';
import { TNavigationDirection } from 'Controls/interface';
import { format as EntityFormat, Record as EntityRecord } from 'Types/entity';

import { IRange, ITimelineColumnsFilter, ITimelineColumnsNavigation } from './ITimelineGridFactory';
import {
    generateDynamicColumnsData,
    IGenerateDynamicColumnsData,
} from './DynamicColumnsGridDataGenerator';
import { Quantum, getQuantum, getRangeSize, shiftDate } from 'Controls-Lists/_timelineGrid/utils';
import {
    getRangeByNavigation,
    prepareDynamicColumnsFilterRecord,
} from 'Controls-Lists/_timelineGrid/factory/utils';
import type { IHolidaysConfig } from 'Controls-Lists/_timelineGrid/render/Holidays';

export interface ITimelineGridSliceState<TNavigationPosition = Date, TColumnsGridData = Date>
    extends IDynamicGridSliceState<TNavigationPosition, TColumnsGridData> {
    range: IRange;
    holidaysConfig: IHolidaysConfig;
    quantum: Quantum;
}

export default class TimelineGridSlice<
    TColumnsNavigationPosition = Date,
    TColumnsGridData = Date
> extends DynamicGridFactory.slice<TColumnsNavigationPosition, TColumnsGridData> {
    protected state: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;

    get range(): IRange {
        return this.state.range;
    }

    protected _generateDynamicColumnsData(
        props: IGenerateDynamicColumnsData<TColumnsNavigationPosition>
    ) {
        return generateDynamicColumnsData(props);
    }

    protected _generateDynamicColumnsGridDataByColumnsNavigation(
        columnsNavigation: ITimelineColumnsNavigation<TColumnsNavigationPosition>
    ) {
        const dynamicColumnsFilter = {
            direction: columnsNavigation.sourceConfig.direction,
            limit: columnsNavigation.sourceConfig.limit,
            position: columnsNavigation.sourceConfig.position,
            quantum: getQuantum(getRangeByNavigation(columnsNavigation)),
        };

        return this._generateDynamicColumnsData({
            dynamicColumnsFilter,
        });
    }

    protected _generateDynamicColumnsGridDataAfterReload(
        nextState: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>
    ) {
        const { field } = nextState.columnsNavigation.sourceConfig;

        const dynamicFilter = nextState.filter[field];
        const dynamicColumnsFilter = {
            position: dynamicFilter.get('position'),
            direction: dynamicFilter.get('direction'),
            limit: dynamicFilter.get('limit'),
            quantum: getQuantum(nextState.range),
        };
        nextState.dynamicColumnsGridData = this._generateDynamicColumnsData({
            dynamicColumnsFilter,
        });
    }

    protected _prepareDynamicColumnsFilter(
        state: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>,
        actualPosition?: TColumnsNavigationPosition,
        direction?: TNavigationDirection
    ): ITimelineColumnsFilter<TColumnsNavigationPosition> {
        const range = state.range;
        const quantum = getQuantum(range);
        const rangeSize = getRangeSize(range, quantum);
        const limit = direction === 'bothways' ? rangeSize * NAVIGATION_LIMIT_FACTOR : rangeSize;
        let resultDirection = direction;

        let position: Date;
        const dynamicColumnsGridData = this.state.dynamicColumnsGridData;
        if (direction === 'forward') {
            position = new Date(dynamicColumnsGridData[dynamicColumnsGridData.length - 1] as Date);
            shiftDate(position, 'forward', quantum);
        } else if (direction === 'backward') {
            position = new Date(dynamicColumnsGridData[0] as Date);
            shiftDate(position, 'backward', quantum);
        } else {
            position = new Date(state.range.start);
            shiftDate(position, 'backward', quantum, rangeSize);
            resultDirection = 'forward';
        }

        return {
            direction: resultDirection,
            position,
            limit,
            quantum,
        };
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
        return new Date(position as Date) as TColumnsNavigationPosition;
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

    protected _initState(
        loadResult: IListLoadResult,
        config: IDynamicGridDataFactoryArguments<TColumnsNavigationPosition>
    ): ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData> {
        const range = getRangeByNavigation(config.columnsNavigation);
        const quantum = getQuantum(range);

        return {
            ...super._initState(loadResult, config),
            range,
            quantum,
            eventsProperty: config.eventsProperty,
            eventStartProperty: config.eventStartProperty,
            eventEndProperty: config.eventEndProperty,
            eventRender: config.eventRender,
            holidaysConfig: config.holidaysConfig,
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

        if (nextState.range !== this.state.range && nextState.range.shouldReload !== false) {
            const { field } = nextState.columnsNavigation.sourceConfig;

            const dynamicColumnsFilter = this._prepareDynamicColumnsFilter(
                nextState,
                this._columnsPosition,
                'bothways'
            );
            this._columnsPosition = dynamicColumnsFilter.position;

            nextState.filter = {
                ...nextState.filter,
                [field]: this._convertDynamicColumnsFilterToRecord(dynamicColumnsFilter),
            };
        }

        return super._beforeApplyState(nextState) as unknown as ITimelineGridSliceState<
            TColumnsNavigationPosition,
            TColumnsGridData
        >;
    }

    setRange(range: IRange): void {
        if (
            !range.start ||
            !range.end ||
            (this.state.range.start.getTime() === range.start.getTime() &&
                this.state.range.end.getTime() === range.end.getTime())
        ) {
            return;
        }

        this.setState({ range });
    }
}
