/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import { ISelectionObject as ISelection } from 'Controls/interface';
import {
    IEntryPathItem,
    IFlatSelectionStrategyOptions,
    ISelectionItem,
    ITreeSelectionStrategyOptions,
} from '../interface';
import { CrudEntityKey } from 'Types/source';

/**
 * Интерфейс базового класс стратегий выбора
 * @public
 */
export default interface ISelectionStrategy<TItem extends ISelectionItem = ISelectionItem> {
    /**
     * Выбирает элементы с переданными ключам
     * @param {ISelection} selection текущее состояние выбранных ключей
     * @param {CrudEntityKey} key ключ элемента
     * @param searchMode
     * @return {ISelection} новое состояние выбранных элементов
     */
    select(selection: ISelection, key: CrudEntityKey, searchMode?: boolean): ISelection;

    /**
     * Снимает выбор с элементов с переданными ключам
     * @param {ISelection} selection текущее состояние выбранных ключей
     * @param {CrudEntityKey} key ключ элемента
     * @param searchMode
     * @return {ISelection} новое состояние выбранных элементов
     */
    unselect(selection: ISelection, key: CrudEntityKey, searchMode?: boolean): ISelection;

    /**
     * Выбирает все элементы в текущем корне
     *
     * В плоской стратегии всегда один и тот же корень null
     *
     * @param {ISelection} selection текущее состояние выбранных ключей
     * @param {number} limit максимальное число выбранных записей
     * @return {ISelection} новое состояние выбранных элементов
     */
    selectAll(selection: ISelection, limit?: number): ISelection;

    /**
     * Переключает выбор всех элементов в текущем корне
     *
     * @remark В плоской стратегии всегда один и тот же корень - null
     *
     * @param {ISelection} selection текущее состояние выбранных ключей
     * @param {boolean} hasMoreData имеются ли в модели еще не загруженные элементы
     * @return {ISelection} новое состояние выбранных элементов
     */
    toggleAll(selection: ISelection, hasMoreData: boolean): ISelection;

    /**
     * Снимает выбор со всех элементов в текущем корне
     *
     * @remark В плоской стратегии всегда один и тот же корень - null
     *
     * @param {ISelection} selection текущее состояние выбранных ключей
     * @param filter
     * @return {ISelection} новое состояние выбранных элементов
     */
    unselectAll(selection: ISelection, filter?: object): ISelection;

    /**
     * Возвращает selection с выбранными items
     *
     * @param {Array<CollectionItem<Model>>} items массив элементов
     * @return {ISelection} новое состояние выбранных элементов
     */
    selectRange(items: TItem[]): ISelection;

    /**
     * Возвращает состояние элементов для модели
     *
     * @param {ISelection} selection текущее состояние выбранных ключей
     * @param {number} limit ограничивает максимальное число выбранных элементов
     * @param {boolean} searchMode Значение поиска
     * @return {Map<boolean|null, Array<CollectionItem<Model>>>} мапа, в которой для каждого состояния хранится соответствующий список элементов
     */
    getSelectionForModel(
        selection: ISelection,
        limit?: number,
        searchMode?: boolean
    ): Map<boolean | null, TItem[]>;

    /**
     * Обновляет опции
     * @param {ITreeSelectionStrategyOptions|IFlatSelectionStrategyOptions} options Новые опции
     * @void
     */
    update(options: ITreeSelectionStrategyOptions | IFlatSelectionStrategyOptions): void;

    /**
     * Проверяет все ли выбраны элементы
     * @remark В деревянной стратегии проверяет, что выбрано все в текущем узле
     * @param selection текущее состояние выбранных ключей
     * @param hasMoreData имеются ли в модели еще не загруженные элементы
     * @param itemsCount количество элементов в модели
     * @param limit
     * @param byEveryItem true - проверять выбранность каждого элемента по отдельности. Иначе проверка происходит по наличию единого признака выбранности всех элементов.
     * @param {CrudEntityKey} rootKey Корень, в котором считать признак isAllSelected.
     * @return {boolean}
     */
    isAllSelected(
        selection: ISelection,
        hasMoreData: boolean,
        itemsCount: number,
        limit: number,
        byEveryItem?: boolean,
        rootKey?: CrudEntityKey
    ): boolean;

    /**
     * Задает {@link /doc/platform/developmentapl/service-development/service-contract/logic/list/hierarch/calc-entry-path/ ENTRY_PATH} для стратегии.
     * @param {IEntryPathItem[]} entryPath Массив объектов, которые содержат идентификаторы отмеченного "ребенка" и его "родителя"
     */
    setEntryPath(entryPath: IEntryPathItem[]): void;

    /**
     * Сбрасывает состояние стратегии
     */
    reset(): void;
}
