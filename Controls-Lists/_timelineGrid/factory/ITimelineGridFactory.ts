import type { IDataFactory } from 'Controls/dataFactory';
import {
    IDynamicColumnsNavigationSourceConfig,
    IDynamicColumnsNavigation,
    IDynamicGridDataFactoryArguments,
    IDynamicColumnsFilter,
} from 'Controls-Lists/dynamicGrid';
import { Quantum } from 'Controls-Lists/_timelineGrid/utils';
import type { TVisibility } from 'Controls/interface';

export type TAggregationVisibility = Extract<TVisibility, 'visible' | 'hidden'>;

export interface IRange {
    start: Date;
    end: Date;
    shouldReload?: boolean;
}

export interface ITimelineColumnsNavigationSourceConfig<TPosition = Date>
    extends IDynamicColumnsNavigationSourceConfig<TPosition> {}

export interface ITimelineColumnsNavigation<TPosition = Date>
    extends IDynamicColumnsNavigation<TPosition> {}

export interface ITimelineColumnsFilter<TPosition = Date> extends IDynamicColumnsFilter<TPosition> {
    quantum: Quantum;
}

export interface ITimelineGridDataFactoryArguments<TNavigationPosition = Date>
    extends IDynamicGridDataFactoryArguments<TNavigationPosition> {
    range: IRange;
    rangeHistoryId?: string;
    aggregationVisibility?: TAggregationVisibility;
    eventsProperty?: string;
    eventStartProperty?: string;
    eventEndProperty?: string;
}

export type ITimelineGridDataFactory = IDataFactory<unknown, ITimelineGridDataFactoryArguments>;
