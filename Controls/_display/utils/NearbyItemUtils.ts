/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Model } from 'Types/entity';
import CollectionItem from '../CollectionItem';
import CollectionEnumerator from 'Controls/_display/CollectionEnumerator';

/**
 * Возвращает соседний элемент проекции
 * @param enumerator Энумератор элементов
 * @param item Элемент проекции относительно которого искать
 * @param isNext Искать следующий или предыдущий элемент
 * @param [conditionProperty] Свойство, по которому происходит отбор элементов
 */
export function getFlatNearbyItem<
    S extends Model = Model,
    T extends CollectionItem<S> = CollectionItem<S>
>(enumerator: CollectionEnumerator<T>, item: T, isNext: boolean, conditionProperty?: string): T {
    const method = isNext ? 'moveNext' : 'movePrevious';
    let nearbyItem;

    enumerator.setCurrent(item);
    while (enumerator[method]()) {
        nearbyItem = enumerator.getCurrent();
        if (conditionProperty && !nearbyItem[conditionProperty]) {
            nearbyItem = undefined;
            continue;
        }
        break;
    }
    enumerator.reset();

    return nearbyItem;
}
