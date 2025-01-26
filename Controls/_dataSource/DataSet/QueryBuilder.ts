import {
    default as NavigationController,
    INavigationChanges,
} from 'Controls/_dataSource/NavigationController';
import type {
    IQueryParams,
    TNavigationDirection,
    INavigationSourceConfig,
    INavigationPageSourceConfig,
    IIgnoreNavigationConfig,
    TKey,
    INavigationPositionSourceConfig,
    TSourceOption,
} from 'Controls/interface';
import { Query, QueryWhereExpression } from 'Types/source';
import type { CrudEntityKey, QueryOrderSelector, QuerySelectExpression } from 'Types/source';
import { RecordSet } from 'Types/collection';
import type { IPagination, TNavSourceConfig } from 'Controls/_dataSource/DataSet';
import { relation } from 'Types/entity';
import isExpandAll from './isExpandAll';
import getQueryInstance from './getQueryInstance';

export interface IQueryBuilderProps {
    parentProperty?: string;
    root?: TKey;
    loadKey?: TKey;
    expandedItems?: TKey[];
    deepReload?: boolean;
    deepScrollLoad?: boolean;
    direction?: TNavigationDirection;
    sorting?: QueryOrderSelector;
    filter?: QueryWhereExpression<unknown>;
    fields?: QuerySelectExpression;
    navigationController?: NavigationController;
    paginationConfig?: TNavSourceConfig;
    pagination?: IPagination;
    keepNavigation?: boolean;
    nodeProperty?: string;
    keyProperty?: string;
    source?: TSourceOption;
}

export default class QueryBuilder {
    _props: IQueryBuilderProps;

    constructor(props: IQueryBuilderProps) {
        this._props = props;
    }

    getQuery(): Query {
        let queryParams: IQueryParams | IQueryParams[] = {
            filter: this._props.filter,
            sorting: this._props.sorting,
            select: this._props.fields,
        };

        if (this._props.parentProperty) {
            queryParams = this._prepareHierarchyQueryParams(queryParams);
        }

        if (this._props.navigationController && !this._props.paginationConfig?.ignoreNavigation) {
            queryParams = this._preparePaginationQueryParams(
                queryParams,
                this._props.navigationController
            );
        }

        return this._getQueryInstance(queryParams);
    }

    updateQuery(loadedItems: RecordSet): void {
        const hierarchyRelation = this._hasHierarchyRelation()
            ? QueryBuilder.getHierarchyRelation(this._props)
            : undefined;

        if (this._props.navigationController) {
            this._props.navigationController?.updateQueryProperties(
                loadedItems,
                this._props.root,
                // @ts-ignore
                this._props.paginationConfig,
                this._props.direction,
                hierarchyRelation
            );
        }
    }

    calculatePaginationChanges(loadedItems: RecordSet): INavigationChanges | undefined {
        const hierarchyRelation = this._hasHierarchyRelation()
            ? QueryBuilder.getHierarchyRelation(this._props)
            : undefined;

        if (this._props.navigationController) {
            const loadedKey =
                this._props.loadKey !== undefined ? this._props.loadKey : this._props.root;
            return this._props.navigationController?.calculateNextQueryProperties(
                loadedItems,
                loadedKey,
                // @ts-ignore
                this._props.paginationConfig,
                this._props.direction,
                hierarchyRelation,
                !this._props.direction && !this._isExpandAll() && this._isQueryForRoot()
            );
        }
    }

    _getQueryInstance(queryParams: IQueryParams | IQueryParams[]): Query {
        let query;
        if (Array.isArray(queryParams)) {
            const queriesArray = queryParams.map((params) => {
                return getQueryInstance(params);
            });
            if (queriesArray.length > 1) {
                query = queriesArray[0].union.apply(queriesArray[0], queriesArray.slice(1));
            } else {
                query = queriesArray[0];
            }
        } else {
            query = getQueryInstance(queryParams);
        }

        return query;
    }

    _prepareHierarchyQueryParams(queryParams: IQueryParams): IQueryParams {
        const { parentProperty, loadKey, root } = this._props;
        const nodeKey = loadKey !== undefined ? loadKey : root;
        let filter = {
            ...queryParams.filter,
        } as Record<string, unknown>;

        if (nodeKey !== undefined && parentProperty && !Array.isArray(filter[parentProperty])) {
            filter = {
                ...filter,
                [parentProperty]: nodeKey,
            };
        }

        return {
            ...queryParams,
            filter,
        };
    }

    _preparePaginationQueryParams(
        queryParams: IQueryParams,
        navController: NavigationController
    ): IQueryParams | IQueryParams[] {
        const { expandedItems, direction, keepNavigation, paginationConfig } = this._props;
        const isMultiPagination =
            QueryBuilder.isMultiPagination(this._props.pagination) &&
            expandedItems?.length &&
            !this._isExpandAll() &&
            (!this._props.direction || this._props.deepScrollLoad) &&
            (this._isQueryForRoot() || keepNavigation);

        let resultQueryParams;

        if (isMultiPagination && this._props.parentProperty) {
            resultQueryParams = navController.getQueryParamsForHierarchy(
                queryParams,
                // @ts-ignore
                paginationConfig,
                !keepNavigation,
                queryParams.filter &&
                    ((queryParams.filter as Record<string, unknown>)[
                        this._props.parentProperty
                    ] as CrudEntityKey[]),
                this._props.loadKey,
                this._props.direction
            );
        }

        if (!isMultiPagination || !resultQueryParams || !resultQueryParams.length) {
            const resetNavigation =
                ((!isMultiPagination ||
                    !this._isQueryForRoot() ||
                    !!paginationConfig ||
                    !isMultiPagination) &&
                    !keepNavigation) ||
                !!direction;

            resultQueryParams = navController.getQueryParams(
                queryParams,
                this._props.loadKey,
                // @ts-ignore
                this._props.paginationConfig,
                this._props.direction,
                resetNavigation
            );
        }

        return resultQueryParams;
    }

    _isQueryForRoot(): boolean {
        const root = this._props.root ?? null;
        return root === this._props.loadKey || this._props.loadKey === undefined;
    }

    _isExpandAll(): boolean {
        return isExpandAll(this._props.expandedItems);
    }

    _hasHierarchyRelation(): boolean {
        return !!(
            this._props.parentProperty &&
            (QueryBuilder.isMultiPagination(this._props.pagination) ||
                this._props.expandedItems?.length)
        );
    }

    static isMultiPagination(pagination?: IPagination): boolean {
        function isValidSourceConfig(
            config?: INavigationSourceConfig
        ): config is INavigationPageSourceConfig | INavigationPositionSourceConfig {
            return !!(config && !(config as IIgnoreNavigationConfig).ignoreNavigation);
        }
        return !!(
            isValidSourceConfig(pagination?.sourceConfig) &&
            pagination?.sourceConfig?.multiNavigation
        );
    }

    static getHierarchyRelation(props: IQueryBuilderProps): relation.Hierarchy {
        return new relation.Hierarchy({
            parentProperty: props.parentProperty,
            nodeProperty: props.nodeProperty,
            keyProperty: props.keyProperty,
        });
    }
}
