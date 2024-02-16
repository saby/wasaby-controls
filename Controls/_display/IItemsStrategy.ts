/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import Abstract from './Abstract';

/**
 * Интерфейс, описывающий основные опции стратегии
 * @private
 */
export interface IOptions<S, T> {
    // Исходная коллекция
    display?: Abstract<S, T>;
    // Декорируемая стратегия
    source?: IItemsStrategy<S, T>;
}

/**
 * Интерфейс стратегии получения элементов проекции.
 * @private
 */
export default interface IItemsStrategy<S, T> {
    readonly '[Controls/_display/IItemsStrategy]': boolean;

    /**
     * Возвращает опции конструктора
     */
    readonly options: IOptions<S, T>;

    /**
     * Декорируемая стратегия
     */
    readonly source: IItemsStrategy<S, T>;

    /**
     * Возвращает количество элементов проекции
     */
    readonly count: number;

    /**
     * Возвращает элементы проекции
     */
    readonly items: T[];

    /**
     * Возвращает элемент по позиции
     * @param {Number} index Позиция
     * @return {Controls/_display/CollectionItem}
     */
    at(index: number): T;

    /**
     * Модифицирует состав элементов проекции при модификации исходной коллекции
     * @param {Number} start Позиция в коллекции
     * @param {Number} deleteCount Количество удаляемых элементов
     * @param {Array} [added] Добавляемые элементы
     * @return {Controls/_display/CollectionItem} Удаленные элементы
     */
    splice(start: number, deleteCount: number, added?: S[]): T[];

    /**
     * Сбрасывает все сформированные результаты
     */
    reset(): void;

    /**
     * Очищает закэшированные результаты
     */
    invalidate(): void;

    /**
     * Возвращает позицию в проекции по позиции в коллекции
     * @param {Number} index Позиция в коллекции
     * @return {Number}
     */
    getDisplayIndex(index: number): number;

    /**
     * Возвращает позицию в коллекции по позиции в проекции
     * @param {Number} index Позиция в проекции
     * @return {Number}
     */
    getCollectionIndex(index: number): number;
}
