import {CrudEntityKey} from 'Types/source';
import {RecordSet} from 'Types/collection';

type THistoryId = string;
type THistoryData = CrudEntityKey | object;

/**
 * Интерфейс конфигурации загрузки истории
 * @interface Controls/HistoryStore:IHistoryLoadConfig
 * @public
 */
interface IHistoryLoadConfig {
    /**
     * Количество недавно выбранных в истории выбора
     * @default 10
     */
    recent?: number | null;
    /**
     * Количество часто выбранных в истории выбора
     * @default 10
     */
    frequent?: number | null;
    /**
     * Количество запиненных в истории выбора
     * @default 10
     */
    pinned?: number | null;
}

/**
 * Варианты типов элементов истории выбора.
 * @enum Controls/HistoryStore:historyItemType
 * @property {String} RECENT - Последний выбранный элемент.
 * @property {String} FREQUENT - Часто выбираемый элемент.
 * @property {String} PINNED - Запиненные элемент.
 * @public
 */

/**
 * Интерфейс элемента в истории выбора
 * @interface Controls/HistoryStore:IHistoryItem
 * @public
 */
interface IHistoryItem {
    /**
     * Идентификатор элемента в истории
     */
    ObjectId: CrudEntityKey;
    /**
     * Идентификатор элемента в истории
     */
    ObjectData?: string;
    /**
     * Идентификатор элемента в истории
     */
    HistoryId: THistoryId;
    /**
     * Счетчик популярности
     */
    Counter: number;
}

/**
 * Интерфейс истории выбора, которая хранится на клиенте
 * @interface Controls/HistoryStore:IHistoryStoreData
 * @public
 */
interface IHistoryStoreData {
    /**
     * Последние выбранные
     */
    recent: RecordSet<IHistoryItem> | null;
    /**
     * Часто выбираемые
     */
    frequent: RecordSet<IHistoryItem> | null;
    /**
     * Запиненные
     */
    pinned: RecordSet<IHistoryItem> | null;
}

/**
 * Интерфейс объекта с параметрами, который передаётся в метод обновления истории
 * @interface Controls/HistoryStore:IHistoryUpdateConfig
 * @public
 */
interface IHistoryUpdateConfig {
    /**
     * Дополнительные параметры истории
     */
    params?: {
        [key: string]: {
            data: string;
        };
    };
}

type THistoryLoadConfig = IHistoryLoadConfig | Record<THistoryId, IHistoryLoadConfig>;

interface IHistoryStore {
    // Выполняет загрузку истории по переданному идентификатору
    load(
        historyId: THistoryId | THistoryId[],
        config?: THistoryLoadConfig
    ): Promise<IHistoryStoreData>;

    // Синхронно возвращает историю из кэша, если она была ранее загружена
    getLocal(historyId: THistoryId): IHistoryStoreData;

    // Выполнить запинивание/распинивание записи в истории
    togglePin(historyId: THistoryId, id: CrudEntityKey, value?: boolean): Promise<void>;

    // Добавить элемент в историю
    push(
        historyId: THistoryId,
        value: THistoryData | Record<THistoryId, THistoryData>
    ): Promise<string>;

    // Обновить элемент в истории
    update(
        historyId: THistoryId,
        id: CrudEntityKey,
        value: THistoryData,
        config?: IHistoryUpdateConfig
    ): Promise<void>;

    // Удалить элемент из истории
    delete(historyId: string, id: CrudEntityKey): Promise<void>;

    // Выполнить запинивание/распинивание записи локально
    togglePinLocal(historyId: THistoryId, id: CrudEntityKey, value?: boolean): void;
}

/**
 * Класс предоставляющий публичное API для работы с историей выбора
 * @singleton
 * @class Controls/HistoryStore:Store
 * @public
 * @author Герасимов А.
 * @example
 * <pre class="brush: js">
 *     import {Store} from 'Controls/HistoryStore';
 *
 *     Store.load('myHistoryId').then(() => {
 *         ...
 *     });
 * </pre>
 */

/**
 * Загружает историю выбора по переданному идентификатору
 * @function Controls/HistoryStore:Store#load
 * @param {string} historyId Идентификатор истории
 * @param {Controls/HistoryStore:IHistoryLoadConfig} historyLoadConfig Задаёт кол-во элементов, которые будут загружены с сервиса истории. Необязательный аргумент.
 * @return {Promise<Controls/HistoryStore:IHistoryStoreData>}
 * @example
 * <pre class="brush: js">
 *     import {Store} from 'Controls/HistoryStore';
 *
 *     Store.load('myHistoryId').then(() => {
 *         ...
 *     });
 * </pre>
 */

/**
 * Синхронно возвращает историю из кэша по переданному идентификатору, если она была ранее загружена
 * @function Controls/HistoryStore:Store#getLocal
 * @param {string} historyId Идентификатор истории
 * @return {Controls/HistoryStore:IHistoryStoreData}
 * @remark Если история не была загружена, метод выкинет исключение
 * @example
 * <pre class="brush: js">
 *     import {Store} from 'Controls/HistoryStore';
 *
 *     const history = Store.getLocal('myHistoryId');
 *     ...
 *
 * </pre>
 */

/**
 * Добавляет в историю выбора элемент по переданному идентификатору
 * @function Controls/HistoryStore:Store#push
 * @param {string} historyId Идентификатор истории
 * @param {Object|string|number} historyValue Значение, которое будет сохранено в историю выбора.
 * @param {Controls/HistoryStore:IHistoryUpdateConfig}
 * @remark В историю можно сохранять не только примитивы (идентификаторы записей в виде строки или числа), но и объекты или массивы.
 * В таком случае, идентификатор элемента истории будет сгенерирован, а сохранённый объект можно будет получить из поля ObjectData элемента истории.
 * @return {Promise<void>}
 * @example
 * <pre class="brush: js">
 *     import {Store} from 'Controls/HistoryStore';
 *
 *     Store.push('myHistoryId', someId);
 * </pre>
 */

/**
 * Удаляет элемент из истории выбора
 * @function Controls/HistoryStore:Store#delete
 * @return {Promise<void>}
 * @param {string} historyId Идентификатор истории
 * @param {string|number} elementId Идентификатор элемента из истории
 */

/**
 * Выполняет запинивание/распинивание элемента в истории
 * @function Controls/HistoryStore:Store#togglePin
 * @return {Promise<void>}
 * @param {string} historyId Идентификатор истории
 * @param {string|number} elementId Идентификатор элемента из истории
 */

/**
 * Выполняет обновление элемента в истории
 * @function Controls/HistoryStore:Store#update
 * @return {Promise<void>}
 * @param {string} historyId Идентификатор истории
 * @param {string|number} elementId Идентификатор элемента из истории
 * @param {Object|string} historyData Значение, которое будет сохранено в поле ObjectData для элемента истории с переданным идентификатором
 * @param {Controls/HistoryStore:IHistoryUpdateConfig}
 */

/**
 * @private
 */
let Store: IHistoryStore;

/**
 * Библиотека с публичным API для работы с историей выбора.
 * @library Controls/HistoryStore
 * @public
 * @includes Store Controls/HistoryStore:Store
 * @includes IHistoryStoreData Controls/HistoryStore:IHistoryStoreData
 * @includes IHistoryItem Controls/HistoryStore:IHistoryItem
 * @includes IHistoryLoadConfig Controls/HistoryStore:IHistoryLoadConfig
 * @public
 * @author Герасимов А.М.
 */

export {
    THistoryId,
    IHistoryItem,
    IHistoryStoreData,
    THistoryLoadConfig,
    IHistoryLoadConfig,
    THistoryData,
    IHistoryStore,
    Store,
};
