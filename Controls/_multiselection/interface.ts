/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import {
    IBaseCollection,
    ICollectionItem,
    ISourceDataStrategy,
} from 'Controls/display';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { TSelectionCountMode, TSelectionType } from 'Controls/interface';

import { default as ISelectionStrategy } from './SelectionStrategy/ISelectionStrategy';
import { IHasMoreUtil } from 'Controls/_multiselection/Utils/Flat';
import { IIsLoadedUtil } from 'Controls/_multiselection/Utils/Tree';

export type TKeys = CrudEntityKey[];

/**
 * Интерфейс описывающий элемент модели, используемой в контроллере множественного выбора
 *
 * @interface Controls/_multiselection/ISelectionItem
 * @public
 */
export interface ISelectionItem extends ICollectionItem {
    /**
     * Определяет, можно ли выбрать данный элемент
     */
    SelectableItem: boolean;

    /**
     * Определяет, запрещено ли изменение состояния чекбокса
     * @function
     * @public
     * @return {Boolean}
     */
    isReadonlyCheckbox(): boolean;

    /**
     * Флаг, определяющий состояние правого свайпа по записи.
     * @function
     * @public
     * @return {Boolean} состояние правого свайпа
     */
    isAnimatedForSelection(): boolean;

    /**
     * Флаг, определяющий состояние правого свайпа по записи.
     * @param {Boolean} swiped состояние правого свайпа
     * @function
     * @public
     */
    setAnimatedForSelection(swiped: boolean): void;

    /**
     * Определяет состояние выбранности элемента
     * @return {boolean|null} состояние выбранности элемента
     * @function
     * @public
     */
    isSelected(): boolean | null;

    /**
     * Задает состояние выбранности элемента
     * @function
     * @public
     */
    setSelected(value: boolean | null, silent?: boolean): void;
}

/**
 * Интерфейс модели, используемой в контроллере множественного выбора
 *
 * @interface Controls/_multiselection/ISelectionModel
 * @public
 */
export interface ISelectionModel
    extends IBaseCollection<Model, ISelectionItem> {
    /**
     * Проверить, можно ли загрузить еще данные
     *
     * @function
     * @public
     * @return {boolean}
     */
    hasMoreData(): boolean;

    /**
     * Получить список элементов
     * @function
     * @public
     * @return {RecordSet} список элементов
     */
    getSourceDataStrategy(): ISourceDataStrategy;

    /**
     * Возвращает кол-во элементов в проекции
     * @function
     * @public
     * @return {number} кол-во элементов
     */
    getCount(): number;

    /**
     * Возвращает список элементов
     * @function
     * @public
     * @return {ISelectionItem[]} список элементов
     */
    getItems(): ISelectionItem[];

    /**
     * Свойство, хранящее доступность чекбоксов (enabled, disabled, hidden)
     * @function
     * @public
     * @return {ISelectionItem[]} список элементов
     */
    getMultiSelectAccessibilityProperty(): string;

    /**
     * Возвращает индекс записи в коллекции по ее ключу
     * @param key
     */
    getIndexByKey(key: CrudEntityKey): number;
}

export interface ISelectionControllerOptions {
    filter: object;
    sorting?: object[];
    model: ISelectionModel;
    selectedKeys: TKeys;
    excludedKeys: TKeys;
    strategy?: ISelectionStrategy;
    strategyOptions?:
        | IFlatSelectionStrategyOptions
        | ITreeSelectionStrategyOptions;
    searchMode?: boolean;
    rootKey: CrudEntityKey;

    keyProperty: string;
    nodeProperty: string;
    parentProperty: string;
    hasChildrenProperty: string;
    childrenCountProperty: string;
    childrenProperty: string;
    multiSelectAccessibilityProperty: string;

    selectionType: TSelectionType;
    selectionCountMode: TSelectionCountMode;
    recursiveSelection: boolean;
    selectAncestors: boolean;
    selectDescendants: boolean;
    hasMoreUtil: IHasMoreUtil;
    isLoadedUtil: IIsLoadedUtil;
}

export interface ITreeSelectionStrategyOptions
    extends IFlatSelectionStrategyOptions {
    selectAncestors: boolean;
    selectDescendants: boolean;
    rootKey: CrudEntityKey;
    entryPath: IEntryPathItem[];
    selectionType: TSelectionType;
    selectionCountMode: TSelectionCountMode;
    recursiveSelection: boolean;
    feature1188089336: boolean;
}

export interface IFlatSelectionStrategyOptions {
    model: ISelectionModel;
}

/**
 * Изменения в списке ключей
 * @interface Controls/_multiselection/IKeysDifference
 * @public
 */
export interface IKeysDifference {
    /**
     * @cfg {Array.<Types/source:CrudEntityKey>} Список ключей
     */
    keys: TKeys;

    /**
     * @cfg {Array.<Types/source:CrudEntityKey>} Список добавленных ключей
     */
    added: TKeys;

    /**
     * @cfg {Array.<Types/source:CrudEntityKey>} Список удаленных ключей
     */
    removed: TKeys;
}

/**
 * Изменения в выбранных элементах
 * @interface Controls/_multiselection/ISelectionDifference
 * @public
 */
export interface ISelectionDifference {
    /**
     * @cfg {Controls/_multiselection/IKeysDifference} Изменения в выбранных элементах
     */
    selectedKeysDifference: IKeysDifference;

    /**
     * @cfg {IKeysDifference} Изменения в исключенных элементах
     */
    excludedKeysDifference: IKeysDifference;
}

/**
 * Данные в рекорде
 * Используется чтобы определить состояние узла с незагруженными детьми
 * @private
 */
export interface IEntryPathItem {
    id: CrudEntityKey;
    parent: CrudEntityKey;
}
