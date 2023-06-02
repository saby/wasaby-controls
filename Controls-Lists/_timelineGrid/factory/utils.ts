import { Record, adapter as EntityAdapter, format as EntityFormat } from 'Types/entity';

import { NAVIGATION_LIMIT_FACTOR, Utils as DynamicGridUtils } from 'Controls-Lists/dynamicGrid';
import { TNavigationDirection } from 'Controls/interface';
import { Quantum, shiftDate } from 'Controls-Lists/_timelineGrid/utils';
import { IRange, ITimelineColumnsFilter, ITimelineColumnsNavigation } from './ITimelineGridFactory';
import { getQuantum } from '../utils';

export interface IPrepareDynamicColumnsFilter {
    columnsNavigation: ITimelineColumnsFilter;
    actualPosition?: unknown;
    actualDirection?: TNavigationDirection;
}

export function prepareDynamicColumnsFilterRecord<
    TPositionFieldFormat extends EntityFormat.DateTimeField,
    TPosition = Date
>(
    dynamicColumnsFilter: ITimelineColumnsFilter<TPosition>,
    adapter: EntityAdapter.IAdapter,
    positionFieldFormat: new (props: unknown) => TPositionFieldFormat
): Record {
    const result = DynamicGridUtils.prepareDynamicColumnsFilterRecord(
        dynamicColumnsFilter,
        adapter,
        positionFieldFormat
    );

    result.addField(
        new EntityFormat.StringField({ name: 'quantum' }),
        null,
        dynamicColumnsFilter.quantum
    );

    return result;
}

export function getRangeByNavigation<TPosition = Date>(navigation: ITimelineColumnsNavigation<TPosition>): IRange {
    const rangeSize = navigation.sourceConfig.limit / NAVIGATION_LIMIT_FACTOR;

    const start = new Date(navigation.sourceConfig.position as Date);
    const end = new Date(navigation.sourceConfig.position as Date);
    shiftDate(end, 'forward', Quantum.Day, rangeSize);

    return { start, end };
}

export function prepareDynamicColumnsFilter<TPosition = Date>(
    columnsNavigation: ITimelineColumnsNavigation<TPosition>
): ITimelineColumnsFilter<TPosition> {
    const range = getRangeByNavigation(columnsNavigation);
    const quantum = getQuantum(range);

    return {
        ...DynamicGridUtils.prepareDynamicColumnsFilter<TPosition>({columnsNavigation}),
        quantum
    };
}
