import type { TKey } from 'Controls/interface';

export const ExpandChangeName = 'EXPAND';
export const CollapseChangeName = 'COLLAPSE';
export type TExpandChangeName = typeof ExpandChangeName;
export type TCollapseChangeName = typeof CollapseChangeName;

/* Развернуть узлы по переданными ключам */
export interface IExpandChange {
    name: TExpandChangeName;
    args: {
        keys: TKey[];
    };
}
/* Свернуть узлы по переданным ключам */
export interface ICollapseChange {
    name: TCollapseChangeName;
    args: {
        keys: TKey[];
    };
}
export type TExpandCollapseChanges = IExpandChange | ICollapseChange;
