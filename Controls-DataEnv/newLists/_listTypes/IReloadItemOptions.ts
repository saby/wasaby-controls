import { IFilterOptions, TKey } from 'Controls-DataEnv/interface';
import type { RecordSet } from 'Types/collection';
import type { Model } from 'Types/entity';

/**
 * Результат перезагрузки элемента
 * */
export type IReloadItemResult = Promise<RecordSet | Model>;

/**
 * Интерфейс параметров перезагрузки элемента
 */
export interface IReloadItemOptions extends IFilterOptions {
    /**
     * Метод с помощью которого будут запрошены данные с БЛ.
     */
    method?: 'read' | 'query';

    /**
     * Объект с метаданными, которые будут переданы в запросе к БЛ. Актуально указывать только в том случае если {@link Controls/_list/interface/IReloadItemOptions#method method} === 'read'.
     */
    readMeta?: object;

    /**
     * Определяет, как загруженный элемент будет применяться к коллекции.
     * Если параметр имеет значение true, элемент коллекции будет заменен загруженным элементом.
     * Если параметр имеет значение false (по умолчанию), загруженные элементы будут объединены в элемент коллекции.
     */
    replace?: boolean;

    /**
     * Определяет каким образом производить обновление записи в иерархических списках.
     * Если указано true, то будет отправлен запрос методом query на обновление всей иерархии которой принадлежит обновляемая запись.
     * В противном случае будет обновлена лишь сама запись.
     * Для иерархического обновления так же необходимо передать опции {@link parentProperty} и {@link nodeProperty}.
     */
    hierarchyReload?: boolean;
    /**
     * Определяет, будет ли сохранено состояние навигации после перезагрузки.
     * По умолчанию состояние навигации не сохраняется.
     */
    keepNavigation?: boolean;
    /**
     * Имя поля записи, в котором хранится {@link /docs/js/Types/entity/applied/PrimaryKey/ первичный ключ}.
     */
    keyProperty?: string;
    /**
     * Развёрнутые узлы
     */
    expandedItems?: TKey[];
    /**
     * Корневой узел
     */
    root?: TKey;
    /**
     * Рекордсет списка
     */
    items: RecordSet;
    /**
     * Имя поля записи, в котором хранится информация о {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy типе элемента} (лист, узел, скрытый узел).
     */
    nodeProperty?: string;
    /**
     * Имя поля записи, в котором хранится информация о родительском узле элемента.
     */
    parentProperty?: string;
}
