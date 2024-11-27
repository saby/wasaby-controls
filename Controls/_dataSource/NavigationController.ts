/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { RecordSet, List } from 'Types/collection';
import { Logger } from 'UI/Utils';

import * as cClone from 'Core/core-clone';

import INavigationStore from './NavigationController/interface/INavigationStore';
import IParamsCalculator from './NavigationController/interface/IParamsCalculator';
import {
    default as PageNavigationStore,
    IPageNavigationState,
} from './NavigationController/PageNavigationStore';
import PageParamsCalculator from './NavigationController/PageParamsCalculator';
import {
    default as PositionNavigationStore,
    IPositionNavigationState,
} from './NavigationController/PositionNavigationStore';
import PositionParamsCalculator from './NavigationController/PositionParamsCalculator';

import { IQueryParams } from 'Controls/_interface/IQueryParams';
import {
    TNavigationSource,
    IBaseSourceConfig,
    INavigationSourceConfig,
    TNavigationDirection,
    TNavigationPagingMode,
} from 'Controls/interface';
import { IHashMap } from 'Types/declarations';
import { applied, Record as EntityRecord, Model, relation } from 'Types/entity';
import { isEqual } from 'Types/object';
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';

/**
 * Вспомогательный интерфейс для определения типа typeof object.
 * @interface IType
 * @private
 */
/*
 * Additional interface to set typeof types
 * @interface IType
 * @private
 * @author Аверкиев П.А.
 */
type IType<T> = new (...args: unknown[]) => T;
interface INavigationStoresListItem {
    id: TKey;
    store: INavigationStore;
}
interface IAdditionalParamsItem {
    id: TKey;
    addParams: IQueryParams;
}
type TStoreNavigationState = IPositionNavigationState | IPageNavigationState;
export type INavigationChanges = {
    navigationItems: NavigationItem[];
    updateResult: TStoreNavigationState[];
    resetNavigation: boolean;
};
/**
 * Фабрика для создания экземпляра контроллера запроса навигации.
 * @remark
 * Поддерживает два варианта - 'page' и 'position'.
 * @class Controls/_source/NavigationControllerFactory
 * @example
 * const cName:INavigationOptionValue<INavigationPageSourceConfig> = {source: 'page'};
 * const controller = NavigationControllerFactory.resolve(cName);
 * @private
 */
/*
 * Navigation query controller instance Factory
 * @remark
 * Supports two variants of navigation query controllers - 'page' and 'position'
 * @class Controls/_source/NavigationControllerFactory
 * @example
 * const cName:INavigationOptionValue<INavigationPageSourceConfig> = {source: 'page'};
 * const controller = NavigationControllerFactory.resolve(cName);
 * @private
 * @author Аверкиев П.А.
 */

class NavigationStoreFactory {
    static factorySource: IHashMap<IType<INavigationStore>> = {
        page: PageNavigationStore,
        position: PositionNavigationStore,
    };

    static resolve(type: TNavigationSource, config: INavigationSourceConfig): INavigationStore {
        if (type && type in this.factorySource) {
            return new this.factorySource[type](config);
        }
        Logger.error('NavigationController: Undefined navigation source type "' + type + '"');
        return;
    }
}

export interface INavigationControllerOptions {
    /**
     * @name Controls/_source/NavigationController#navigation
     * @cfg {Types/source:INavigationOptionValue<INavigationSourceConfig>} Опции навигации.
     */
    /*
     * @name Controls/_source/NavigationController#navigation
     * @cfg {Types/source:INavigationOptionValue} Navigation options
     */
    navigationType: TNavigationSource;
    navigationConfig?: INavigationSourceConfig;
    navigationParamsChangedCallback?: Function;
}

type TKey = string | number | null; // TODO общий тип
type TNavResult = object | number | boolean;
type NavigationItem = {
    metaMore: TNavResult;
    storeId: TKey;
    listForCurrentStore?: Model[];
    additionalMeta?: object;
    store: INavigationStore;
};
type NavigationRecord = EntityRecord<{
    id: TKey;
    nav_result: TNavResult;
}>;

/**
 * Контроллер постраничной навигации.
 * @remark
 * Хранит состояние навигации INavigationOptionValue<INavigationSourceConfig> и вычисляет на его основании параметры для построения запроса Query.
 *
 * @class Controls/dataSource/NavigationController
 *
 *
 * @public
 */
/*
 * Per-page navigation controller
 * @remark
 * Stores the navigation state and calculates on its base params to build Query
 *
 * @class Controls/dataSource/NavigationController
 *
 *
 * @public
 * @author Аверкиев П.А.
 */

export default class NavigationController {
    private _navigationType: TNavigationSource;
    private _navigationConfig: INavigationSourceConfig;
    private _navigationParamsChangedCallback: Function;
    private _navigationStores: List<INavigationStoresListItem> = null;
    private _paramsCalculator: IParamsCalculator = null;

    constructor(cfg: INavigationControllerOptions) {
        this._navigationType = cfg.navigationType;
        this._navigationConfig = cfg.navigationConfig;
        this._navigationParamsChangedCallback = cfg.navigationParamsChangedCallback;

        if (this._navigationType) {
            this._navigationStores = new List();
        } else {
            Logger.error('NavigationController: navigationType option is undefined');
        }
    }

    /**
     * Строит запрос данных на основе переданных параметров filter и sorting.
     * Если в опцию navigation был передан объект INavigationOptionValue<INavigationSourceConfig>, его filter, sorting и
     * настройки постраничной навигации также добавляются в запрос.
     * @param userQueryParams {IQueryParams} Настройки фильтрации, сортировки.
     * @param navigationConfig {INavigationSourceConfig} Настройки навигации.
     * @param id {TKey} Идентификатор запрашиваемого узла. По-умолчанию - корневой узел.
     * @param direction {TNavigationDirection} Направление навигации.
     * @param reset {boolean} Определяет, расчитывать ли навигацию от начального состояния.
     */

    getQueryParams(
        userQueryParams: IQueryParams,
        id: TKey = null,
        navigationConfig?: IBaseSourceConfig,
        direction?: TNavigationDirection,
        reset: boolean = true
    ): IQueryParams {
        const calculator = this._getCalculator();
        const navigationQueryConfig = this._getNavigationQueryConfig(navigationConfig, reset);
        const mainQueryParams = NavigationController._getMainQueryParams(userQueryParams);

        // Если id не передан то берется стор для корневого раздела, для которого жесткий id = null
        const store = this._getStore(id);
        const addQueryParams = calculator.getQueryParams(
            store,
            navigationQueryConfig,
            direction,
            this._navigationParamsChangedCallback,
            reset
        );
        return NavigationController._mergeParams(mainQueryParams, addQueryParams);
    }

    getQueryParamsForHierarchy(
        userQueryParams: IQueryParams,
        navigationConfig?: IBaseSourceConfig,
        reset: boolean = true,
        ids: TKey[] = [],
        root?: TKey,
        direction?: TNavigationDirection
    ): IQueryParams[] {
        const calculator = this._getCalculator();
        const navigationQueryConfig = this._getNavigationQueryConfig(navigationConfig, reset);
        const mainQueryParams = NavigationController._getMainQueryParams(userQueryParams);

        const addQueryParamsArray: IAdditionalParamsItem[] = [];
        const processStoreItem = (storeItem: INavigationStoresListItem) => {
            const store = storeItem.store;

            if (!ids || !ids.length || ArrayUtil.invertTypeIndexOf(ids, storeItem.id) !== -1) {
                const navConfig =
                    navigationQueryConfig instanceof Map
                        ? navigationQueryConfig.get(storeItem.id)
                        : navigationQueryConfig;
                let resetQueryParams = reset;
                let queryDirection;

                if (storeItem.id === root && direction) {
                    queryDirection = direction;
                    resetQueryParams = false;
                }
                addQueryParamsArray.push({
                    id: storeItem.id,
                    addParams: calculator.getQueryParams(
                        store,
                        navConfig,
                        queryDirection,
                        this._navigationParamsChangedCallback,
                        resetQueryParams
                    ),
                });
            }
        };
        this._navigationStores.each((storeItem) => {
            processStoreItem(storeItem);
        });
        if (ids && ids.length) {
            ids.forEach((id) => {
                if (!this.hasLoaded(id)) {
                    processStoreItem({
                        store: this._getStore(id),
                        id,
                    });
                }
            });
        }
        // Порядок навигации важен.
        // текущий рут ставим первым, потому что так нужно БЛ
        if (root !== undefined) {
            addQueryParamsArray.sort((elem) => (elem.id === root ? 1 : 0));
        }
        return NavigationController._mergeParamsHierarchical(mainQueryParams, addQueryParamsArray);
    }

    protected _getNextNavigationItems(
        list: RecordSet,
        parent: TKey = null,
        hierarchyRelation?: relation.Hierarchy
    ): NavigationItem[] {
        const metaMore: TNavResult = list.getMetaData().more;
        const items: NavigationItem[] = [];
        const calculator = this._getCalculator();
        if (metaMore instanceof RecordSet) {
            metaMore.each((nav: NavigationRecord) => {
                const storeId = nav.get('id');
                items.push({
                    storeId,
                    store: this._getStore(storeId).clone(),
                    metaMore: nav.get('nav_result'),
                    listForCurrentStore: hierarchyRelation?.getChildren(storeId, list) as Model[],
                    additionalMeta: calculator.getAdditionalMeta(list, storeId as string),
                });
            });
        } else {
            // Если id не передан, то берется store для корневого раздела, для которого жесткий id = null
            items.push({
                storeId: parent,
                store: this._getStore(parent).clone(),
                metaMore,
            });
        }
        return items;
    }

    protected _updateNavigationItems(
        navigationItems: NavigationItem[],
        list: RecordSet,
        direction?: TNavigationDirection,
        navigationConfig?: IBaseSourceConfig
    ): TStoreNavigationState[] {
        const calculator = this._getCalculator();
        return navigationItems.map(
            ({ metaMore, listForCurrentStore, additionalMeta, store }: NavigationItem) =>
                calculator.updateQueryProperties(
                    store,
                    list,
                    metaMore,
                    navigationConfig,
                    direction,
                    listForCurrentStore,
                    additionalMeta
                ) as TStoreNavigationState
        );
    }

    /**
     * Применяет изменения к контроллеру параметров запроса
     * @function Controls/_source/NavigationControllerFactory#applyChanges
     */
    /*
     * Apply changes to query params controller
     */
    applyChanges(changes?: INavigationChanges): void {
        if (!changes) {
            return;
        }
        const { navigationItems, resetNavigation } = changes;
        navigationItems.forEach(({ store, storeId }) => this._setStore(storeId, store));
        if (resetNavigation) {
            this._deleteUnprocessedStores(navigationItems.map(({ storeId }) => storeId));
        }
    }

    /**
     * Вычисляет следующее состояние контроллера параметров запроса: следующую страницу или позицию.
     * @function Controls/_source/NavigationControllerFactory#calculateNextQueryProperties
     * @param {Types/collection:RecordSet} list Объект, содержащий метаданные текущего запроса.
     * @param {TNavigationDirection} direction Направление навигации ('up' или 'down').
     */
    /*
     * Calculates next query params controller state: next page, or position
     * @param list {Types/collection:RecordSet} object containing meta information for current request
     * @param direction {TNavigationDirection} nav direction ('up' or 'down')
     */
    calculateNextQueryProperties(
        list: RecordSet,
        id: TKey = null,
        navigationConfig?: IBaseSourceConfig,
        direction?: TNavigationDirection,
        hierarchyRelation?: relation.Hierarchy,
        resetNavigation: boolean = true
    ): INavigationChanges {
        const navigationItems = this._getNextNavigationItems(list, id, hierarchyRelation);
        const updateResult = this._updateNavigationItems(
            navigationItems,
            list,
            direction,
            navigationConfig
        );
        return {
            navigationItems,
            updateResult,
            resetNavigation,
        };
    }

    /**
     * Обновляет состояние контроллера параметров запроса: переход на следующую страницу или позицию.
     * @function Controls/_source/NavigationControllerFactory#updateQueryProperties
     * @param {Types/collection:RecordSet} list Объект, содержащий метаданные текущего запроса.
     * @param {TNavigationDirection} direction Направление навигации ('up' или 'down').
     */
    /*
     * Update query params controller state: next page, or position
     * @param list {Types/collection:RecordSet} object containing meta information for current request
     * @param direction {TNavigationDirection} nav direction ('up' or 'down')
     */
    updateQueryProperties(
        list: RecordSet,
        id: TKey = null,
        navigationConfig?: IBaseSourceConfig,
        direction?: TNavigationDirection,
        hierarchyRelation?: relation.Hierarchy,
        resetNavigation: boolean = true
    ): TStoreNavigationState[] {
        const queryProperties = this.calculateNextQueryProperties(
            list,
            id,
            navigationConfig,
            direction,
            hierarchyRelation,
            resetNavigation
        );
        this.applyChanges(queryProperties);
        return queryProperties.updateResult;
    }

    updateQueryRange(
        list: RecordSet,
        id: TKey = null,
        firstItem?: Model | void,
        lastItem?: Model | void
    ): void {
        const calculator = this._getCalculator();
        const store = this._getStore(id);
        calculator.updateQueryRange(store, list, firstItem, lastItem);
    }

    shiftToEdge(
        direction: TNavigationDirection,
        id: TKey = null,
        shiftMode?: TNavigationPagingMode
    ): IBaseSourceConfig {
        const calculator = this._getCalculator();
        const store = this._getStore(id);
        return calculator.shiftToEdge(store, direction, shiftMode, this._navigationConfig);
    }
    // Если id не передан, то берется store для корневого раздела, для которого жесткий id = null
    hasMoreData(direction?: TNavigationDirection, id: TKey = null): boolean {
        let hasMoreResult = false;

        if (this.hasLoaded(id)) {
            const store = this._getStore(id);
            const calculator = this._getCalculator();
            hasMoreResult = calculator.hasMoreData(store, direction);
        }

        return hasMoreResult;
    }

    hasLoaded(id: TKey): boolean {
        return this._navigationStores.getIndexByValue('id', id) !== -1;
    }

    reset(key: TKey): void {
        if (!this._navigationStores) {
            return;
        }

        const removedIndex = this._navigationStores.getIndexByValue('id', key);

        if (removedIndex !== -1) {
            this._navigationStores.removeAt(removedIndex);
        }
    }

    updateOptions(newOptions: INavigationControllerOptions): void {
        if (
            newOptions.navigationType !== this._navigationType ||
            !isEqual(newOptions.navigationConfig, this._navigationConfig)
        ) {
            // при передаче новых опций все сбрасываем
            this._navigationStores.each((navigationStore) => {
                navigationStore.store.destroy();
            });
            this._navigationStores = new List();
            this._paramsCalculator?.destroy();
            this._paramsCalculator = null;
            this._navigationType = newOptions.navigationType;
            this._navigationConfig = newOptions.navigationConfig;
        }

        this._navigationParamsChangedCallback = newOptions.navigationParamsChangedCallback;
    }

    private _deleteUnprocessedStores(processedStores: TKey[]): void {
        const storesToDelete = [];
        this._navigationStores.forEach(({ id }) => {
            if (ArrayUtil.invertTypeIndexOf(processedStores, id) === -1) {
                storesToDelete.push(id);
            }
        });
        storesToDelete.forEach((id) => {
            this._navigationStores.removeAt(this._navigationStores.getIndexByValue('id', id));
        });
    }

    private _getStore(id: TKey): INavigationStore {
        const storeIndex = this._navigationStores.getIndexByValue('id', id);
        let resStoreItem: INavigationStoresListItem = this._navigationStores.at(storeIndex);

        if (!resStoreItem) {
            resStoreItem = {
                id,
                store: NavigationStoreFactory.resolve(this._navigationType, this._navigationConfig),
            };
            this._navigationStores.add(resStoreItem);
        }
        return resStoreItem.store;
    }

    private _setStore(id: TKey, store: INavigationStore): void {
        const storeIndex = this._navigationStores.getIndexByValue('id', id);
        this._navigationStores.replace({ id, store }, storeIndex);
    }

    private _getCalculator(): IParamsCalculator {
        if (!this._paramsCalculator) {
            let resCalculator;
            switch (this._navigationType) {
                case 'page':
                    resCalculator = PageParamsCalculator;
                    break;
                case 'position':
                    resCalculator = PositionParamsCalculator;
                    break;
            }
            this._paramsCalculator = new resCalculator();
        }
        return this._paramsCalculator;
    }

    private _getNavigationQueryConfig(
        navigationConfig: IBaseSourceConfig,
        resetNavigation: boolean
    ): IBaseSourceConfig {
        if (navigationConfig) {
            return navigationConfig;
        } else if (resetNavigation) {
            return this._navigationConfig as IBaseSourceConfig;
        } else {
            return {};
        }
    }

    /**
     * разрушает NavigationController
     * @function Controls/_source/NavigationControllerFactory#destroy
     */
    /*
     * destroy current NavigationController
     */
    destroy(): void {
        this._navigationStores.each((navigationStore) => {
            navigationStore.store.destroy();
        });
        this._navigationStores = null;
        this._paramsCalculator?.destroy();
        this._paramsCalculator = null;
        this._navigationType = null;
        this._navigationConfig = null;
    }

    private static _mergeParams(main: IQueryParams, additional: IQueryParams): IQueryParams {
        const resultParams = main;

        resultParams.limit = additional.limit;
        resultParams.offset = additional.offset;

        if (additional.filter) {
            // we can't modify original filter
            resultParams.filter = cClone(resultParams.filter);
            const navFilter = additional.filter;
            for (const i in navFilter) {
                if (navFilter.hasOwnProperty(i)) {
                    resultParams.filter[i] = navFilter[i];
                }
            }
        }

        if (additional.meta) {
            resultParams.meta = additional.meta;
        }

        return resultParams;
    }

    private static _mergeParamsHierarchical(
        main: IQueryParams,
        additional: IAdditionalParamsItem[]
    ): IQueryParams[] {
        const resultParamsArray = [] as IQueryParams[];
        additional.forEach((addItem) => {
            const resultParams = NavigationController._mergeParams({ ...main }, addItem.addParams);

            // we can't modify original filter
            resultParams.filter = cClone(resultParams.filter);

            // Добавляем в фильтр раздел и помечаем это поле, как первичный ключ
            // Оно используется для формирования множественной навигации,
            // Само поле будет удалено из фильтра перед запросом.
            (resultParams.filter as Record<string, unknown>).__root = new applied.PrimaryKey(
                addItem.id
            );

            resultParamsArray.push(resultParams);
        });

        return resultParamsArray;
    }

    private static _getMainQueryParams(userQueryParams: IQueryParams): IQueryParams {
        return {
            filter: userQueryParams.filter || {},
            sorting: userQueryParams.sorting,
            select: userQueryParams.select,
            limit: undefined,
            offset: undefined,
        };
    }
}
