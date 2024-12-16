import { Query } from 'Types/source';
import { IQueryParams } from 'Controls/interface';

export default function getQueryInstance(queryParams: IQueryParams): Query {
    let query = new Query();
    if (queryParams.filter) {
        query = query.where(queryParams.filter);
    }
    if (queryParams.offset) {
        query = query.offset(queryParams.offset);
    }
    if (queryParams.limit) {
        query = query.limit(queryParams.limit);
    }
    if (queryParams.sorting) {
        query = query.orderBy(queryParams.sorting);
    }
    if (queryParams.meta) {
        query = query.meta(queryParams.meta);
    }
    if (queryParams.select) {
        query = query.select(queryParams.select);
    }
    return query;
}
