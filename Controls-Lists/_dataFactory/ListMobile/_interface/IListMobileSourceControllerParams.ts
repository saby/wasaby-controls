import type { Direction, TKey } from 'Controls/interface';
import type { ListMobileSource } from '../_source/ListMobileSource';

export type IListMobileSourceControllerParams = {
    source: ListMobileSource;
    filter: {
        SearchString?: string;
    } & Record<string, unknown>;
    pagination: {
        limit: number;
        anchor?: number;
        direction?: Direction;
    };
    root?: TKey;
};
