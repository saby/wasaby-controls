import { Model } from 'Types/entity';
import {
    IAction,
    IActionsState,
    TItemActionsMap,
} from 'Controls-DataEnv/newLists/_abstractList/interface/IAbstractListStateParts/IActionsState';
import type { RecordSet } from 'Types/collection';

/**
 * Параметры метода createActionsMap, извлекающего экшены для конкретной записи.
 */
export type TGetActionsForItemParams = Pick<
    IActionsState,
    'itemActionsProperty' | 'itemActions' | 'itemActionVisibilityCallback'
>;

/**
 * Создаёт новую карту ItemActions с парами ключ=>экшны
 */
export default function createActionsMap(
    items: RecordSet,
    itemActionsConfig: TGetActionsForItemParams
): TItemActionsMap {
    const map: TItemActionsMap = new Map();
    items.forEach((item) => {
        map.set(item.getKey(), getActionsForItem(item, itemActionsConfig));
    });
    return map;
}

/**
 * Возвращает действия над записью для каждого элемента списка.
 */
function getActionsForItem(
    item: Model,
    { itemActionsProperty, itemActions, itemActionVisibilityCallback }: TGetActionsForItemParams
): IAction[] {
    let actions: IAction[];
    // Предзагрузка происходит только для тех экшнов, которые указаны на слайсе,
    // поэтому их надо там указывать независимо от того, что экшны для каждой записи приходят в itemActionsProperty.
    // FIXME: Тут вроде бы написана чушь.
    if (itemActionsProperty && (item.get(itemActionsProperty)?.length || !itemActions?.length)) {
        actions = item.get(itemActionsProperty) || [];
    } else {
        actions = itemActions || [];
    }

    // TODO isEditing
    const isEditing = false;

    return actions.reduce((result, action) => {
        if (
            !itemActionVisibilityCallback ||
            itemActionVisibilityCallback(action, item, isEditing)
        ) {
            result.push(action);
        }
        return result;
    }, [] as IAction[]);
}
