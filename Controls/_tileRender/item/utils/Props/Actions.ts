import { TileCollection, TileCollectionItem } from 'Controls/tile';
import { Model } from 'Types/entity';
import { IActionsProps, IItemAction } from 'Controls/interface';
import { TTileActionsPosition } from 'Controls/_tileRender/interface/IRenderAspects';
import { ITileViewProps } from 'Controls/_tileRender/interface/ITileView';

interface IGetItemActionProps {
    collectionItem: TileCollectionItem;
    collection: TileCollection<Model<any>>;
}

export interface ITileActionProps
    extends Pick<
        IActionsProps<TTileActionsPosition>,
        | 'actions'
        | 'actionsVisibility'
        | 'actionsDisplayDelay'
        | 'actionsPosition'
        | 'actionsClassName'
        | 'actionStyle'
    > {}

export function getActionsProps({
    collectionItem,
    collection,
}: IGetItemActionProps): ITileActionProps {
    return {
        actions: collectionItem.getActions()
            ? (collectionItem.getActions().showed as IItemAction[])
            : undefined,
        actionsVisibility: collection.getActionsVisibility(),
        actionsPosition: collection.getItemActionsPosition(),
        actionsDisplayDelay: collection.getActionsDisplayDelay(),
    };
}

interface IGetItemActionHandlers
    extends Pick<
        ITileViewProps,
        | 'onItemActionSwipeAnimationEnd'
        | 'onActionMouseUp'
        | 'onActionMouseDown'
        | 'onActionClick'
        | 'onActionMouseEnter'
        | 'onActionMouseLeave'
        | 'onActionsMouseEnter'
    > {}

/**
 * Возвращает набор обработчиков для опций записи
 **/
export function getItemActionHandlers({
    onActionMouseUp,
    onActionMouseDown,
    onActionMouseEnter,
    onActionMouseLeave,
    onActionsMouseEnter,
    onActionClick,
    onItemActionSwipeAnimationEnd,
}: IGetItemActionHandlers) {
    return {
        onActionMouseUp,
        onActionMouseDown,
        onActionMouseEnter,
        onActionMouseLeave,
        onActionsMouseEnter,
        onActionClick,
        onItemActionSwipeAnimationEnd,
    };
}
