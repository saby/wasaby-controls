import { useLayoutEffect, useState } from 'react';
import { IItemAction } from 'Controls/interface';
import { CollectionItem } from 'Controls/display';
import { IItemActionsHandler } from 'Controls/_baseList/interface/IItemActionsHandler';
import { usePreviousProps } from 'Controls/_baseList/Render/hooks/usePreviousProps';

interface IUseItemActionsDeferredInitializationProps {
    item: CollectionItem;
    itemActionsTemplateMountedCallback: IItemActionsHandler['itemActionsTemplateMountedCallback'];
    itemActionsTemplateUnmountedCallback: IItemActionsHandler['itemActionsTemplateUnmountedCallback'];
}

/**
 * Хук, позволяющий отложенно отрисовать itemActions в уже отрисованном элементе,
 * не прибегая к синхронизации всего элемента.
 * Колбек itemActionsTemplateMountedCallback сохраняет соответствие setState ключу записи внутри itemActionsController
 * Колбек itemActionsTemplateMountedCallback очищает соответствие setState ключу записи внутри itemActionsController
 * @private
 * @param item
 * @param itemActionsTemplateMountedCallback
 * @param itemActionsTemplateUnmountedCallback
 */
export const useItemActionsDeferredInitialization = ({
    item,
    itemActionsTemplateMountedCallback,
    itemActionsTemplateUnmountedCallback,
}: IUseItemActionsDeferredInitializationProps): IItemAction[] => {
    const [itemActions, setItemActions] = useState(item.getActions()?.showed || []);
    const itemKey = item?.key;
    const { prevItemKey } = usePreviousProps({ prevItemKey: itemKey });

    // Мы должны вызывать props.itemActionsTemplateMountedCallback при маунте.
    // useLayoutEffect синхронно будет вызывать коллбек из пропсов.
    // В его зависимостях должны быть
    // 1. коллбек, иначе если изначально коллбека не было, реакт не сообразит,
    //    что коллбек появился и эффект пора применить.
    // 2. текущая запись, т.к. могли до отрисовки шаблона поменять itemActions
    //    и обновить версию записи. В таком случае нужно пперерисовать операции.
    // 3. Иногда запись могут подменить в списке, присвоив ей новый ключ, тогда при разрушении
    //    нужно использовать предыдущий ключ записи, если он был установлен.
    useLayoutEffect(() => {
        itemActionsTemplateMountedCallback?.(itemKey, setItemActions);
        return () => {
            itemActionsTemplateUnmountedCallback?.(prevItemKey || itemKey);
        };
    }, [
        item,
        prevItemKey,
        itemKey,
        itemActionsTemplateMountedCallback,
        itemActionsTemplateUnmountedCallback,
    ]);

    return itemActions;
};
