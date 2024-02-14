import { adapter as EntityAdapter, format as EntityFormat, Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { date as formatDate } from 'Types/formatter';
import { Logger } from 'UI/Utils';

import { Utils as DynamicGridUtils } from 'Controls-Lists/dynamicGrid';
import { TNavigationDirection } from 'Controls/interface';
import { IRange, ITimelineColumnsFilter } from './ITimelineGridFactory';
import { getQuantum, getRangeSize, Quantum, shiftDate } from 'Controls-Lists/_timelineGrid/utils';
import { HOLIDAY_DATE_FORMAT } from 'Controls-Lists/_timelineGrid/render/Holidays';

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

export function prepareDynamicColumnsFilter<TPosition = Date>(
    range: IRange,
    direction: TNavigationDirection,
    startPositionToForward?: TPosition,
    startPositionToBackward?: TPosition
): ITimelineColumnsFilter<TPosition> {
    const quantum = getQuantum(range);
    const limit = getRangeSize(range, quantum);
    let resultDirection = direction;

    let position: Date;
    if (direction === 'forward') {
        position = new Date(startPositionToForward as unknown as Date);
        shiftDate(position, 'forward', quantum);
    } else if (direction === 'backward') {
        position = new Date(startPositionToBackward as unknown as Date);
        shiftDate(position, 'backward', quantum);
    } else {
        position = new Date(range.start);
        resultDirection = 'forward';
    }

    return {
        direction: resultDirection,
        position: position as unknown as TPosition,
        limit,
        quantum,
    };
}

export function applyLoadedHolidaysCalendar(
    items: RecordSet,
    loadedItems: RecordSet,
    direction: Exclude<TNavigationDirection, 'bothways'>,
    calendarProperty: string,
    dynamicColumnsGridData: Date[]
): void {
    if (!calendarProperty || !loadedItems) {
        return;
    }

    const currentHolidaysCalendar = items.getMetaData()[calendarProperty] as RecordSet;
    const loadedHolidaysCalendar = loadedItems.getMetaData()[calendarProperty] as RecordSet;
    if (!currentHolidaysCalendar) {
        return;
    }
    if (!loadedHolidaysCalendar) {
        Logger.error(
            `При подгрузке колонок в мета-данных не вернули данные для выходных. Поле "${calendarProperty}"`
        );
        return;
    }

    // https://online.saby.ru/opendoc.html?guid=8c291cf4-96f4-442e-8186-e1020b07a373&client=3
    loadedHolidaysCalendar.setKeyProperty(currentHolidaysCalendar.getKeyProperty());

    const startColumnDataKey = formatDate(dynamicColumnsGridData[0], HOLIDAY_DATE_FORMAT);
    const endColumnDataKey = formatDate(
        dynamicColumnsGridData[dynamicColumnsGridData.length - 1],
        HOLIDAY_DATE_FORMAT
    );

    DynamicGridUtils.applyLoadedColumnsData(
        currentHolidaysCalendar,
        loadedHolidaysCalendar,
        direction,
        startColumnDataKey,
        endColumnDataKey
    );
}
