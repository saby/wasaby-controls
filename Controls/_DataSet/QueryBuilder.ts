import { getQueryInstance, NavigationController } from 'Controls/dataSource';
import type {
    IQueryParams,
    TNavigationDirection,
    IBasePositionSourceConfig,
    IBasePageSourceConfig,
} from 'Controls/interface';
import { Query } from 'Types/source';
import type {
    CrudEntityKey,
    QueryOrderSelector,
    QueryWhereExpression,
    QuerySelectExpression,
} from 'Types/source';
import { RecordSet } from 'Types/collection';

export interface IQueryBuilderProps {
    parentProperty?: string;
    root?: CrudEntityKey | null;
    nextRoot?: CrudEntityKey | null;
    expandedKey?: CrudEntityKey;
    direction?: TNavigationDirection;
    sorting?: QueryOrderSelector;
    filter?: QueryWhereExpression<unknown>;
    fields?: QuerySelectExpression;
    navigationController?: NavigationController;
    pagination?: IBasePositionSourceConfig | IBasePageSourceConfig;
}

export default class QueryBuilder {
    #props: IQueryBuilderProps;

    constructor(props: IQueryBuilderProps) {
        this.#props = props;
    }

    getQuery(): Query {
        let queryParams: IQueryParams = {
            filter: this.#props.filter,
            sorting: this.#props.sorting,
            select: this.#props.fields,
        };

        if (this.#props.parentProperty) {
            let parentValue;

            if (this.#props.expandedKey !== undefined) {
                parentValue = this.#props.expandedKey;
            } else {
                parentValue = this.#props.nextRoot ?? this.#props.root ?? null;
            }

            queryParams.filter = {
                ...queryParams,
                [this.#props.parentProperty]: parentValue,
            };
        }

        if (this.#props.navigationController) {
            queryParams = this.#props.navigationController?.getQueryParams(
                queryParams,
                this.#props.root,
                this.#props.pagination,
                this.#props.direction,
                this.#props.nextRoot !== undefined && this.#props.root !== this.#props.nextRoot
            );
        }

        return this.#getQueryInstance(queryParams);
    }

    updateQuery(loadedItems: RecordSet): void {
        if (this.#props.navigationController) {
            this.#props.navigationController?.updateQueryProperties(
                loadedItems,
                this.#props.root,
                this.#props.pagination,
                this.#props.direction
            );
        }
    }

    #getQueryInstance(queryParams: IQueryParams | IQueryParams[]): Query {
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
}
