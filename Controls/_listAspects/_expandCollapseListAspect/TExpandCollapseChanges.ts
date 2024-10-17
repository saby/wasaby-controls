import type { TKey } from 'Controls/interface';
import type { TExpansionModel } from './common/TExpansionModel';

export const ExpandChangeName = 'EXPAND';
export const CollapseChangeName = 'COLLAPSE';
export const ExpansionMapChangeName = 'SET_EXPANSION_MODEL';

export type TExpansionChangeName = typeof ExpandChangeName | typeof CollapseChangeName;
export type TExpansionMapChangeName = typeof ExpansionMapChangeName;

/* Свернуть/Развернуть узлы по переданным ключам */
export interface TExpansionChange {
    name: TExpansionChangeName;
    args: {
        keys: TKey[];
    };
}

/* Свернуть/Развернуть узлы по набору ключей */
export interface TExpansionMapChange {
    name: TExpansionMapChangeName;
    args: {
        expansionModel: TExpansionModel;
    };
}

export type TExpandCollapseChanges = TExpansionChange | TExpansionMapChange;
