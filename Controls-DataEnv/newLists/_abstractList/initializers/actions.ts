import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type {
    IAction,
    IActionsState,
    TItemActionsMap,
} from '../interface/IAbstractListStateParts/IActionsState';
import type { Initializer } from '../Initializer';
import { isValidActions, isValidVisibilityCb } from '../validators/actions';
import resolveValue from './utils/resolveValue';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

export default function initState(
    initializer: Initializer,
    __: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IActionsState {
    const state: IActionsState = {
        itemActions: resolveValue(config.itemActions, isValidActions),
        listActions: resolveValue(config.listActions, isValidActions),
        itemActionsProperty: config.itemActionsProperty,
        itemActionVisibilityCallback: resolveValue(
            config.itemActionVisibilityCallback,
            isValidVisibilityCb
        ),
    };

    if (state.itemActions?.length) {
        const items = initializer.getItemsState().items;
        if (items) {
            state.itemActionsMap = createItemActionsMap(items, state);
        }
    }

    return state;
}

/**
 * Параметры метода createItemActionsMap, извлекающего экшены для конкретной записи.
 */
export type TGetActionsForItemParams = Pick<
    IActionsState,
    'itemActionsProperty' | 'itemActions' | 'itemActionVisibilityCallback'
>;

/**
 * Создаёт новую карту ItemActions с парами ключ=>экшны
 */
export function createItemActionsMap(
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
