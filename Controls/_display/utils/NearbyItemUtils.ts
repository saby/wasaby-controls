/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Model } from 'Types/entity';
import CollectionItem from 'Controls/_display/CollectionItem';
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
>(
    enumerator: CollectionEnumerator<T>,
    item: T,
    isNext: boolean,
    conditionProperty?: string
): T {
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
