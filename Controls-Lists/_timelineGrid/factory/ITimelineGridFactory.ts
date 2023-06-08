import type { IDataFactory } from 'Controls/dataFactory';
import {
    IDynamicColumnsNavigationSourceConfig,
    IDynamicColumnsNavigation,
    IDynamicGridDataFactoryArguments,
    IDynamicColumnsFilter,
} from 'Controls-Lists/dynamicGrid';
import { Quantum } from 'Controls-Lists/_timelineGrid/utils';

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
    extends IDynamicGridDataFactoryArguments<TNavigationPosition> {}

export type ITimelineGridDataFactory = IDataFactory<unknown, ITimelineGridDataFactoryArguments>;
