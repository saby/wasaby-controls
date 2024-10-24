/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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
