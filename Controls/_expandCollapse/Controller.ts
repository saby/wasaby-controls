/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { Model } from 'Types/entity';
import { isEqual } from 'Types/object';
import { TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { Tree, TreeItem } from 'Controls/baseTree';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import {
    IExpandCollapseState,
    COMPATIBLE_ALL_EXPANDED_VALUE as ALL_EXPANDED_VALUE,
    CompatibleExpandCollapseStateManager as ExpandCollapseStateManager,
} from 'Controls/expandCollapseListAspect';
import { CrudEntityKey } from 'Types/source';

export { ALL_EXPANDED_VALUE };
/**
 * Интерфейс, описывающий структуру объекта конфигурации {@link Controller ExpandController}
 * @private
 */
export interface IOptions {
    /**
     * Модель с которой будет управлять контроллер
     */
    model?: Tree<Model, TreeItem<Model>>;
    /**
     * Ф-ия загрузчик, которая будет вызвана перед разворачиванием итема.
     * В случае удачной загрузки должна вернуть RecordSet с полученными данными.
     * В случе неудачной загрузки либо рейзнуть ошибку либо вернуть void.
     */
    loader?: (id: TKey) => void | Promise<RecordSet | void>;
    /**
     * Массив с идентификаторами развернутых узлов
     */
    expandedItems?: TKey[];
    /**
     * Массив с идентификаторами свернутых узлов
     */
    collapsedItems?: TKey[];
    /**
     * true если на одном уровне может быть раскрыт только один узел
     */
    singleExpand?: boolean;
}

export interface IResult {
    expandedItems?: TKey[];
    collapsedItems?: TKey[];
}

/**
 * Класс контроллера, который реализует логику сворачивания/разворачивания итемов
 * @private
 */
export class Controller {
    // region fields
    private _options: IOptions;

    private _expandedItems: TKey[];

    private _collapsedItems: TKey[];

    private _model: Tree<Model, TreeItem<Model>>;

    /**
     * Флаг, идентифицирующий нужно или нет вызывать ф-ию загрузчик
     * при развороте узлов.
     */
    private _loaderIsEnabled: boolean = true;

    // endregion

    constructor(options: IOptions) {
        this._options = options;
        this._model = options.model;
        this.setExpandedItems(options.expandedItems ? [...options.expandedItems] : []);
        this.setCollapsedItems(options.collapsedItems ? [...options.collapsedItems] : []);
    }

    /**
     * Обновляет опции контроллера записывая новые опции поверх существующих.
     * Соответственно если какую-либо опцию обновлять не надо, то не нужно её
     * указывать в newOptions.
     */
    updateOptions(newOptions: IOptions): void {
        const modelRecreated = this._model !== newOptions.model;
        this._options = { ...this._options, ...newOptions };
        this._model = newOptions.model;

        if (
            newOptions.collapsedItems &&
            !isEqual(this._collapsedItems, newOptions.collapsedItems)
        ) {
            this.setCollapsedItems(newOptions.collapsedItems);
        }

        if (modelRecreated) {
            this._model?.setExpandedItems(this._expandedItems);
            this._model?.setCollapsedItems(this._collapsedItems);
        }

        // Обновление здесь expandedItems не реализовано т.к. пока не требуется из-за того что в treeControl
        // обновление expandedItems хитрое под кучей if'ов
        if (newOptions.expandedItems) {
            throw new Error(
                'expandCollapse:Controller#updateOptions update expandedItems not implemented yet'
            );
        }
    }

    isAllExpanded(expandedItems: TKey[] = this._expandedItems): boolean {
        return expandedItems[0] === ALL_EXPANDED_VALUE;
    }

    isItemExpanded(itemId: TKey): boolean {
        return ExpandCollapseStateManager.isExpanded(this._getCompatibleState(), itemId);
    }

    /**
     * Вернет true если итем с указанной id в текущий момент свернут
     */
    isItemCollapsed(itemId: TKey): boolean {
        return !this.isItemExpanded(itemId);
    }

    /**
     * Меняет признак свернутости/развернутости итема на противоположный.
     * В случае раскрытия итема если его данные еще не были загружены вернет
     * Promise с загруженными данными узла.
     */
    toggleItem(itemId: TKey): IResult | Promise<IResult> {
        if (this.isItemExpanded(itemId)) {
            return this.collapseItem(itemId);
        } else {
            return this.expandItem(itemId);
        }
    }

    expandItem(itemId: TKey): IResult | Promise<IResult> {
        const { expandedItems, collapsedItems } = ExpandCollapseStateManager.expand(
            this._getCompatibleState(),
            itemId
        );
        return this._applyState(expandedItems, collapsedItems);
    }

    collapseItem(itemId: TKey): IResult {
        const { expandedItems, collapsedItems } = ExpandCollapseStateManager.collapse(
            this._getCompatibleState(),
            itemId
        );
        return this._applyState(expandedItems, collapsedItems) as IResult;
    }

    resetExpandedItems(): IResult {
        return this._applyState([], []) as IResult;
    }

    getExpandedItems(): TKey[] {
        return [...this._expandedItems];
    }

    setExpandedItems(expandedItems: TKey[] = []): void {
        if (!isEqual(expandedItems, this._expandedItems)) {
            this._expandedItems = [...expandedItems];
            this._model?.setExpandedItems(this._expandedItems);
        }
    }

    getCollapsedItems(): TKey[] {
        return [...this._collapsedItems];
    }

    setCollapsedItems(collapsedItems: TKey[]): void {
        if (collapsedItems && !isEqual(collapsedItems, this._collapsedItems)) {
            this._collapsedItems = [...collapsedItems];
            this._model?.setCollapsedItems(this._collapsedItems);
        }
    }

    disableLoader(): void {
        this._loaderIsEnabled = false;
    }

    enableLoader(): void {
        this._loaderIsEnabled = true;
    }

    onCollectionRemove(removedItems: TreeItem[]): IResult {
        const keys = removedItems
            .filter((it) => it['[Controls/_display/TreeItem]'])
            .map((it) => it.key);
        return ExpandCollapseStateManager.onCollectionRemove(this._getCompatibleState(), keys);
    }

    /**
     * Выполняет анализ и обработку переданных данных:
     * 1. Если опция singleExpand выставлена, то оставит только по одной id в expandedItems
     * для каждого уровня иерархии
     * 2. При схлапывании узла id его дочерних расхлопнутых узлов также выкидываются из expandedItems
     * 3. Если expandedItems и collapsedItems имеют пересечение, то это пересечение выкидывается из
     * expandedItems
     */
    private _applyState(
        expandedItems: TKey[] = [],
        collapsedItems: TKey[] = []
    ): IResult | Promise<IResult> {
        const result = this._applyExpandedItems(expandedItems);
        const newState = {
            expandedItems,
            collapsedItems,
        };
        return result instanceof Promise
            ? result.then(() => {
                  return newState;
              })
            : newState;
    }

    private _applyExpandedItems(expandedItems: TKey[]): void | Promise<RecordSet[]> {
        const expandDiff = ArraySimpleValuesUtil.getArrayDifference(
            this._expandedItems,
            expandedItems
        );

        // Если изменили с [...] на [ALL_EXPANDED_VALUE], то нужно загрузить все кроме явно схлопнутых
        if (expandDiff.added[0] === ALL_EXPANDED_VALUE) {
            const results = [];

            // Пробежимся по итемам модели и развернем все для
            // которых явно не сказано что они должны быть свернуты
            this._model?.each((item) => {
                // пропускаем не разворачиваемые элементы и листья
                if (
                    !item['[Controls/_display/TreeItem]'] ||
                    !item.Expandable ||
                    item.isNode() === null
                ) {
                    return;
                }

                const id = item.getContents().getKey();
                // Если запись это лист или явно сказано что запись должна быть свернута,
                // то и не разворачиваем её
                if (this._collapsedItems.includes(id)) {
                    return;
                }

                const result = this._expandItem(id);
                if (result) {
                    results.push(result);
                }
            });

            // Если асинхронных результатов нет, то сразу присваиваем
            if (!results.length) {
                return;
            }

            return Promise.all(results);
        }

        // region Если изменили с [...] на [...], то нужно загрузить добавленные ключи
        if (expandDiff.added.length) {
            const results = [];
            expandDiff.added.forEach((id) => {
                const result = this._expandItem(id);

                if (result) {
                    results.push(result);
                }
            });

            // Если асинхронных результатов нет, но проставляем expandedItems сразу
            if (!results.length) {
                return;
            }

            return Promise.all(results);
        }

        // Если изменили с [ALL_EXPANDED_VALUE] на [...], то ничего грузить не надо, просто обновляем данные
        // endregion
    }

    /**
     * Вызывает загрузку данных для разворачиваемого узла.
     * Дополнительно в случе работы со старой моделью развернет
     * в ней итем с указанным itemId.
     */
    private _expandItem(itemId: TKey): void | Promise<RecordSet | void> {
        // Если в опциях указана ф-ия загрузчик и она включена, то вызовем её
        return this._options.loader && this._loaderIsEnabled
            ? this._options.loader(itemId)
            : undefined;
    }

    private _getCompatibleState(): IExpandCollapseState {
        return {
            expandedItems: this._expandedItems as CrudEntityKey[],
            collapsedItems: this._collapsedItems as CrudEntityKey[],
            parentProperty: this._model.getParentProperty(),
            nodeProperty: this._model.getNodeProperty(),
            items: this._model.getCollection(),
            singleExpand: !!this._options.singleExpand,
            keyProperty: this._model.getKeyProperty(),
            declaredChildrenProperty: this._model.getHasChildrenProperty(),
        };
    }
}
