/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import {
    IBaseSourceConfig,
    TNavigationDirection,
    TNavigationPagingMode,
} from 'Controls/interface';
import INavigationStore from './INavigationStore';
import { IQueryParams } from 'Controls/_interface/IQueryParams';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
export default interface IParamsCalculator {
    hasMoreData(
        store: INavigationStore,
        direction: TNavigationDirection
    ): boolean;
    getQueryParams(
        store: INavigationStore,
        navigationQueryConfig: IBaseSourceConfig,
        direction?: TNavigationDirection,
        paramsCallback?: Function,
        reset?: boolean
    ): IQueryParams;
    updateQueryProperties(
        store: INavigationStore,
        list: RecordSet,
        metaMore: object | number | boolean,
        navigationQueryConfig: IBaseSourceConfig,
        direction: TNavigationDirection,
        listForCurrentStore?: Model[],
        additionalMeta?: object
    ): unknown;
    shiftToEdge(
        store: INavigationStore,
        direction: TNavigationDirection,
        shiftMode: TNavigationPagingMode,
        navigationQueryConfig: IBaseSourceConfig
    ): IBaseSourceConfig;
    updateQueryRange(
        store: INavigationStore,
        list: RecordSet,
        firstItem?: Model | void,
        lastItems?: Model | void
    ): void;
    getAdditionalMeta(list: RecordSet, id?: string): object;
    destroy(): void;
}
