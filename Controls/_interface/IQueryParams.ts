/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { QueryNavigationType, QueryWhereExpression, QuerySelectExpression } from 'Types/source';
import type { TSortingOptionValue } from 'Controls-DataEnv/listTypes';

export type Direction = 'up' | 'down';

export interface IQueryParamsMeta {
    navigationType?: QueryNavigationType;
    hasMore?: boolean;
}
export interface IQueryParams {
    meta?: IQueryParamsMeta;
    limit?: number;
    offset?: number;
    filter?: QueryWhereExpression<unknown>;
    sorting?: TSortingOptionValue;
    select?: QuerySelectExpression;
}
