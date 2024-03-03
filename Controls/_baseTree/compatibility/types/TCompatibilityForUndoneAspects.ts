import { TCompatibilityForUndoneAspects as TBaseControlCompatibilityForUndoneAspects } from 'Controls/baseList';
import { BaseTreeControl as TBaseTreeControl, IBaseTreeControlOptions } from '../../BaseTreeControl';
import { TKey } from 'Controls/interface';

export type TCompatibilityForUndoneAspects = TBaseControlCompatibilityForUndoneAspects & {
    getExpandedItemsCompatible(
        treeControl: TBaseTreeControl,
        options: IBaseTreeControlOptions
    ): TKey[] | undefined;

    beforeStatDragCompatible(
        key: TKey,
        treeControl: TBaseTreeControl,
        options: IBaseTreeControlOptions
    ): void;
};
