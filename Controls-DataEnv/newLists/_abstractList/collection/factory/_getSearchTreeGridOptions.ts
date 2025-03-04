import type {
    ISearchGridCollectionOptions,
    SearchGridDataRow,
} from 'Controls/searchBreadcrumbsGrid';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getGridOptions from './_getGridOptions';
import getTreeOptions from './_getTreeOptions';
import { Model } from 'Types/entity';

export default function <
    S extends Model = Model,
    T extends SearchGridDataRow<S> = SearchGridDataRow<S>,
>(state: IAbstractListState): ISearchGridCollectionOptions<S, T> {
    return {
        ...getTreeOptions(state),
        ...getGridOptions(state),
    } as unknown as ISearchGridCollectionOptions<S, T>;
}
