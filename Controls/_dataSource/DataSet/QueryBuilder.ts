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
    IBaseSourceConfig,
    INavigationOptionValue,
} from 'Controls/interface';
import { Query } from 'Types/source';
import type { CrudEntityKey, QuerySelectExpression } from 'Types/source';
import { RecordSet } from 'Types/collection';
import type { TNavSourceConfig, IDataSetProps } from 'Controls/_dataSource/DataSet';
import { relation } from 'Types/entity';
import isExpandAll from './isExpandAll';
import getQueryInstance from './getQueryInstance';

export interface IQueryBuilderProps
    extends Pick<
        IDataSetProps,
        'sorting' | 'parentProperty' | 'root' | 'expandedItems' | 'source' | 'filter'
    > {
    loadKey?: TKey;
    deepReload?: boolean;
    deepScrollLoad?: boolean;
    direction?: TNavigationDirection;
    fields?: QuerySelectExpression;
    navigationController?: NavigationController;
    paginationConfig?: TNavSourceConfig;
    pagination?: INavigationOptionValue<INavigationSourceConfig>;
    keepPagination?: boolean;
    nodeProperty?: string;
    keyProperty?: string;
}

function isValidSourceConfig(
    config?: INavigationSourceConfig | IBaseSourceConfig
): config is INavigationPageSourceConfig | INavigationPositionSourceConfig {
    return !(config as IIgnoreNavigationConfig)?.ignoreNavigation;
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

        if (this._props.navigationController && isValidSourceConfig(this._props.paginationConfig)) {
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
        const { expandedItems, direction, keepPagination, paginationConfig } = this._props;
        const loadKey = this._props.loadKey ?? this._props.root;
        const isMultiPagination =
            QueryBuilder.isMultiPagination(paginationConfig || this._props.pagination) &&
            expandedItems?.length &&
            !this._isExpandAll() &&
            (!direction || this._props.deepScrollLoad) &&
            (this._isQueryForRoot() || keepPagination || paginationConfig instanceof Map);

        let resultQueryParams;

        if (isMultiPagination && this._props.parentProperty) {
            resultQueryParams = navController.getQueryParamsForHierarchy(
                queryParams,
                // @ts-ignore
                paginationConfig,
                !keepPagination,
                queryParams.filter &&
                    ((queryParams.filter as Record<string, unknown>)[
                        this._props.parentProperty
                    ] as CrudEntityKey[]),
                loadKey,
                direction
            );
        }

        if (!isMultiPagination || !resultQueryParams || !resultQueryParams.length) {
            const resetNavigation =
                ((!isMultiPagination ||
                    !this._isQueryForRoot() ||
                    !!paginationConfig ||
                    !isMultiPagination) &&
                    !keepPagination) ||
                !!direction;

            resultQueryParams = navController.getQueryParams(
                queryParams,
                loadKey,
                // @ts-ignore
                paginationConfig,
                direction,
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

    static isMultiPagination(
        pagination?: INavigationOptionValue<INavigationSourceConfig> | IBaseSourceConfig
    ): boolean {
        function isPaginationConfig(
            config?: INavigationOptionValue<INavigationSourceConfig> | IBaseSourceConfig
        ): config is INavigationOptionValue<INavigationSourceConfig> {
            return !!config?.hasOwnProperty('sourceConfig');
        }

        if (isPaginationConfig(pagination)) {
            return (
                isValidSourceConfig(pagination.sourceConfig) &&
                !!pagination.sourceConfig.multiNavigation
            );
        } else {
            return isValidSourceConfig(pagination) && !!pagination.multiNavigation;
        }
    }

    static getHierarchyRelation(props: IQueryBuilderProps): relation.Hierarchy {
        return new relation.Hierarchy({
            parentProperty: props.parentProperty,
            nodeProperty: props.nodeProperty,
            keyProperty: props.keyProperty,
        });
    }
}
