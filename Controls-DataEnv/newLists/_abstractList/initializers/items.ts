import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IItemsState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';

export default function initState(
    _: Initializer,
    __: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IItemsState {
    return {
        // При сборке сервисов, использующих библиотеку падают ошибки, так как keyProperty необязательный аргумент.
        // Выглядит так, что в этом случае items стейт вообще не должен инициализироваться. Пока такой хотфикс.
        // Будет исправлено в рамках https://online.sbis.ru/opendoc.html?guid=b055e73f-f034-40b3-8716-ac1551b20c3d&client=3
        keyProperty: config.keyProperty ?? '',
        items: config.items,
        metaData: config.metaData,
        hasMoreStorage: {},
    };
}
