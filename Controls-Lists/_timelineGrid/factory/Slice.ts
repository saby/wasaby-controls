import { IListLoadResult } from 'Controls/dataFactory';
import {
    DynamicGridFactory,
    IDynamicSliceGenerateDynamicColumnsData,
    IDynamicGridSliceState,
} from 'Controls-Lists/dynamicGrid';
import { TNavigationDirection } from 'Controls/interface';

import { format as EntityFormat, Model, Record as EntityRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import {
    IRange,
    TAggregationVisibility,
    ITimelineColumnsFilter,
    ITimelineGridDataFactoryArguments,
} from './ITimelineGridFactory';
import { generateDynamicColumnsData } from './DynamicColumnsGridDataGenerator';
import { Quantum, getQuantum, shiftDate } from 'Controls-Lists/_timelineGrid/utils';
import {
    prepareDynamicColumnsFilterRecord,
    prepareDynamicColumnsFilter,
    applyLoadedHolidaysCalendar,
} from 'Controls-Lists/_timelineGrid/factory/utils';
import { RangeHistoryUtils } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
import type { IHolidaysConfig } from 'Controls-Lists/_timelineGrid/render/Holidays';
import * as React from 'react';
import { TColumnsNavigationMode } from 'Controls-Lists/_dynamicGrid/factory/IDynamicGridFactory';

export interface ITimelineGridSliceState<TNavigationPosition = Date, TColumnsGridData = Date>
    extends IDynamicGridSliceState<TNavigationPosition, TColumnsGridData> {
    range: IRange;
    holidaysConfig: IHolidaysConfig;
    quantum: Quantum;
    rangeHistoryId?: string;
    aggregationVisibility?: TAggregationVisibility;
    eventsProperty?: string;
    eventStartProperty?: string;
    eventEndProperty?: string;
}

export interface ITimelineContextData {
    quantum: Quantum;
}
export const TimelineDataContext = React.createContext<ITimelineContextData>(null);

export interface ITimelineSliceGenerateDynamicColumnsData
    extends IDynamicSliceGenerateDynamicColumnsData {
    dynamicColumnsFilter: ITimelineColumnsFilter<unknown>;
}

export default class TimelineGridSlice<
    TColumnsNavigationPosition = Date,
    TColumnsGridData = Date
> extends DynamicGridFactory.slice<TColumnsNavigationPosition, TColumnsGridData> {
    protected state: ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData>;

    get range(): IRange {
        return this.state.range;
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
            state.range,
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

    protected _applyLoadedItemsToHorizontalDirection(
        loadedItems: RecordSet,
        direction: Exclude<TNavigationDirection, 'bothways'>,
        dynamicColumnsGridData: TColumnsGridData[]
    ): void {
        super._applyLoadedItemsToHorizontalDirection(
            loadedItems,
            direction,
            dynamicColumnsGridData
        );

        if (this.state.holidaysConfig) {
            const items = this.state.sourceController.getItems();
            const { calendarProperty } = this.state.holidaysConfig;
            applyLoadedHolidaysCalendar(
                items,
                loadedItems,
                direction,
                calendarProperty,
                dynamicColumnsGridData as unknown as Date[]
            );
        }
    }

    protected _initState(
        loadResult: IListLoadResult,
        config: ITimelineGridDataFactoryArguments<TColumnsNavigationPosition>
    ): ITimelineGridSliceState<TColumnsNavigationPosition, TColumnsGridData> {
        if (loadResult.range) {
            config.range = loadResult.range;
        }

        const quantum = getQuantum(config.range);

        return {
            ...super._initState(loadResult, config),
            range: config.range,
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

            if (nextState.range.shouldReload !== false) {
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

    private _getColumnsNavigationMode(): TColumnsNavigationMode {
        return 'infinity';
    }
}
