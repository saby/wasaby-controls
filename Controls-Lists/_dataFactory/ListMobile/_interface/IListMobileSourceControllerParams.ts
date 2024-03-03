import type { TKey, Direction } from 'Controls/interface';
import type { ListMobileSource } from '../_source/ListMobileSource';

export type IListMobileSourceControllerParams = {
    source: ListMobileSource;
    filter: {
        search?: string;
    } & Record<string, unknown>;
    pagination: {
        limit: number;
        anchor?: number;
        direction?: Direction;
    };
    root?: TKey;
};
