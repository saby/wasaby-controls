import type { IBaseDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import type { TCollectionType } from '../../collection/types';
import type { IAbstractListState } from '../IAbstractListState';
import type { IPrefetchOptions, IPropStorageOptions } from 'Controls-DataEnv/listTypes';
import type { IFilterDescriptionItem } from 'Controls-DataEnv/interface';
import { IStateThatShouldGoIntoViewLayer } from '../IStateThatShouldGoIntoViewLayer';

/**
 * Интерфейс аргументов абстрактной фабрики данных списка.
 */
export interface IAbstractListDataFactoryArguments
    extends IBaseDataFactoryArguments,
        Partial<
            Pick<
                IAbstractListState,
                | 'items'
                | 'selectedKeys'
                | 'excludedKeys'
                | 'root'
                | 'sliceOwnedByBrowser'
                | 'expandedItems'
                | 'collapsedItems'
                | 'singleExpand'
                | 'viewMode'
                | 'markedKey'
                | 'markerVisibility'
                | 'operationsPanelVisible'
                | 'operationsController'
                | 'itemsOrder'
                | 'nodeProperty'
                | 'parentProperty'
                | 'multiSelectVisibility'
                | 'displayProperty'
                | 'errorController'
                | 'sorting'
                | 'searchParam'
                | 'searchValue'
                | 'searchInputValue'
                | 'minSearchLength'
                | 'searchDelay'
                | 'searchStartingWith'
                | 'searchValueTrim'
                | 'searchNavigationMode'
                | 'filter'
                | 'filterDescription'
                | 'historyId'
                | 'saveToUrl'
                | 'itemActionsProperty'
                | 'isDebugging'
                | 'metaData'
                | 'keyProperty'
                | 'tileMode'
                | 'tileSize'
                | 'tileWidth'
                | 'tileHeight'
                | 'tileWidthProperty'
                | 'tileScalingMode'
                | 'tileFitProperty'
                | 'imageProperty'
                | 'imageWidthProperty'
                | 'imageHeightProperty'
                | 'imageUrlResolver'
                | 'folderWidth'
                | 'orientation'
                | 'navigation'
                | 'emptyViewConfig'
                | '_disableAsyncValidation'
            >
        >,
        IPrefetchOptions,
        IPropStorageOptions,
        IStateThatShouldGoIntoViewLayer {
    collectionType?: TCollectionType;

    /**
     * Набор действий для панели массовых операций или имя модуля, который его экспортирует.
     *
     * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/new-operations/panel-and-list/ "Связь панели массовых операций и списка".}
     */
    listActions?: string | IAbstractListState['listActions'];

    /**
     * Имя модуля, который экспортирует пустое представление.
     */
    emptyView?: string | IAbstractListState['emptyView'];

    /**
     * Конфигурация ячеек заголовков
     */
    header?: string | IAbstractListState['header'];

    /**
     * Конфигурация ячеек данных
     */
    columns?: string | IAbstractListState['columns'];

    /**
     * Набор опций записей в списке или имя модуля, который его экспортирует.
     *
     * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ "Конфигурация опций записей в списке".}
     */
    itemActions?: string | IAbstractListState['itemActions'];

    /**
     * Колбек, определяющий видимость опции записи или имя модуля, который его экспортирует.
     */
    itemActionVisibilityCallback?: string | IAbstractListState['itemActionVisibilityCallback'];

    // Только пока существует старая LoadData.
    // Это не для прикладного использования.
    // По этому флагу платформа отличает новейшие списки от всех остальных.
    // Должно быть удалено из аргументов и оставлено только в результатах фабрики.
    isLatestInteractorVersion?: boolean;

    historyItems?: IFilterDescriptionItem[];
    /**
     * @deprected
     * Режим работы с историей фильтров (для старой панели фильтров)
     * @variant pinned По ховеру на элемент появляется команда закрепления записи.
     * @variant favorite По ховеру на элемент появляется команда добавления записи в избранное.
     */
    historySaveMode?: string;

    // https://online.sbis.ru/opendoc.html?guid=35613055-5678-46e5-9848-24a575a4fcc6&client=3
    task88221034059907?: boolean;
}
