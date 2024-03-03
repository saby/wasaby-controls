/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { IControlOptions } from 'UI/Base';
import { IErrorControllerOptions } from 'Controls/error';
import { CrudEntityKey } from 'Types/source';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';
import {
    ISourceOptions,
    IHierarchyOptions,
    IFilterOptions,
    INavigationOptions,
    ISortingOptions,
    TKey,
} from 'Controls/interface';

export interface IDataOptions
    extends IControlOptions,
        ISourceOptions,
        IHierarchyOptions,
        IFilterOptions,
        INavigationOptions<unknown>,
        ISortingOptions,
        IErrorControllerOptions {
    dataLoadErrback?: Function;
    dataLoadCallback?: Function;
    nodeLoadCallback?: Function;
    root?: TKey;
    groupProperty?: string;
    groupingKeyCallback?: Function;
    groupHistoryId?: string;
    historyIdCollapsedGroups?: string;
    sourceController?: SourceController;
    expandedItems?: CrudEntityKey[];
    nodeHistoryId?: string;
    insideList?: boolean;
    items?: RecordSet;
    // Опция нужна, пока не реализована возможность изменения фильтрации через контекст.
    // По ней мы понимаем, откуда пришёл sourceController: из контекста (c Browser'a) или просто передан руками,
    // чтобы синхронно построить список
    // удалить, когда сделаем контексты
    // https://online.sbis.ru/opendoc.html?guid=0a695664-9688-41d0-9d90-db4914101c7c
    isSourceControllerFromContext?: boolean;
}
