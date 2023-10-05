/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { ISelectionObject as ISelection } from 'Controls/interface';
import { Model } from 'Types/entity';
import { CollectionItem } from 'Controls/display';
import ISelectionStrategy from './SelectionStrategy/ISelectionStrategy';
import {
    ISelectionControllerOptions,
    IKeysDifference,
    ISelectionItem,
    ISelectionModel,
    TKeys,
    ISelectionDifference,
    IEntryPathItem,
} from './interface';
import { CrudEntityKey } from 'Types/source';
import { RecordSet } from 'Types/collection';
import clone = require('Core/core-clone');
import { isEqual } from 'Types/object';
import { TreeSelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/Tree';
import CounterController from 'Controls/_multiselection/CounterController';

/**
 * Контроллер множественного выбора
 * @public
 */
export class Controller {
    private _model: ISelectionModel;
    private _items: RecordSet;
    private _selectedKeys: TKeys = [];
    private _excludedKeys: TKeys = [];
    private _strategy: ISelectionStrategy;
    private _limit: number = 0;
    private _separatedSelectedItems: TKeys = [];
    private _searchMode: boolean;
    private _filter: object;
    private _startFilter: object;
    private _filterChanged: boolean;
    private _sorting: object[];
    private _sortingChanged: boolean;
    private _lastCheckedKey: CrudEntityKey;
    private _rootKey: CrudEntityKey;
    private _selectedItems: ISelectionItem[] = [];

    private _startFilteredItemsCount: number = 0;

    private _counterController: CounterController;

    private get _selection(): ISelection {
        return {
            selected: this._selectedKeys || [],
            excluded: this._excludedKeys || [],
        };
    }

    private set _selection(selection: ISelection) {
        this._selectedKeys = selection.selected;
        this._excludedKeys = selection.excluded;
    }

    constructor(options: ISelectionControllerOptions) {
        this._model = options.model;
        this._items = this._model.getSourceCollection();
        this._selectedKeys = options.selectedKeys ? options.selectedKeys.slice() : [];
        this._excludedKeys = options.excludedKeys ? options.excludedKeys.slice() : [];
        this._strategy = options.strategy;
        this._searchMode = options.searchMode;
        this._filter = options.filter;
        this._sorting = options.sorting;
        this._rootKey = options.rootKey;
        this._selectedItems = this.getSelectedItems();

        this._counterController = new CounterController({
            ...options,
            collection: this._model.getSourceDataStrategy(),
            isSearchViewMode: this._model['[Controls/searchBreadcrumbsGrid:SearchGridCollection]'],
        });
        this._counterController.setSelection(this._selection);
    }

    /**
     * Обновляет состояние контроллера
     * @param {ISelectionControllerOptions} options Новые опции
     * @void
     */
    updateOptions(options: Partial<ISelectionControllerOptions>): ISelection | void {
        const modelChanged = this._model !== options.model;
        const rootChanged = this._rootKey !== options.rootKey;
        const itemsChanged = this._items !== options.model.getSourceCollection();

        this._model = options.model;
        this._items = this._model.getSourceCollection();

        this._counterController.update({
            ...options,
            collection: this._model.getSourceDataStrategy(),
            isSearchViewMode: this._model['[Controls/searchBreadcrumbsGrid:SearchGridCollection]'],
        });
        this._strategy.update(options.strategyOptions);
        this._searchMode = options.searchMode;
        this._rootKey = options.rootKey;

        this._updateFilterAndSorting(options.filter, options.sorting);

        // Возможен кейс, что пришел новый инстанс рекордсета и пересоздалась модель(например поиск).
        // События reset в этом кейсе не произойдет, поэтому обрабатываем тут.
        let newSelection;
        if (itemsChanged && modelChanged) {
            const isAllSelected = this.isAllSelected(false);
            if (this._shouldResetSelectionOnReload(isAllSelected)) {
                newSelection = { selected: [], excluded: [] };
            }
        }

        if ((modelChanged && !newSelection) || rootChanged) {
            this.setSelection(this.getSelection());
        }

        return newSelection;
    }

    /**
     * Возвращает текущий выбор элементов
     * @return {ISelection} Текущий выбор элементов
     */
    getSelection(): ISelection {
        return this._selection;
    }

    /**
     * Проставляет выбранные элементы в модели
     * @void
     */
    setSelection(selection: ISelection): void {
        const isSelectionChanged = !isEqual(selection, this._selection);
        // Прикладники могут задать только selectedKeys и чтобы не было ошибок инициализируем excluded пустым массивом
        if (!selection.excluded) {
            selection.excluded = [];
        }

        this._filterChanged = false;
        this._sortingChanged = false;

        if (!selection.selected.length && !selection.excluded.length) {
            this._strategy.reset();
            this.resetLimit();
            this._separatedSelectedItems = [];
            this._startFilter = null;
            this._startFilteredItemsCount = 0;
        }
        this._selection = selection;
        this._counterController.setSelection(selection);
        this._updateModel(selection);
        if (isSelectionChanged) {
            this._selectedItems = this._strategy.getSelectedItems(
                this._selection,
                this._selectedItems
            );
        }
    }

    getSessionSelectedItems(): Model[] {
        return this._selectedItems.map((item) => {
            return item.getContents();
        });
    }

    /**
     * Возвращает массив выбранных элементов (без учета сортировки, фильтрации и группировки).
     * @return {Array.<Controls/_display/CollectionItem>}
     */
    getSelectedItems(): ISelectionItem[] {
        return this._strategy.getSelectedItems(this._selection);
    }

    /**
     * Установливает ограничение на количество единоразово выбранных записей
     * @param {number} limit Ограничение
     * @void
     * @public
     */
    setLimit(limit: number | undefined): void {
        if (!(limit === undefined)) {
            this._limit = limit;
        }
    }

    /**
     * Возвращает ограничение на количество единоразово выбранных записей
     * @number
     * @public
     */
    getLimit(): number {
        return this._limit + this._separatedSelectedItems.length;
    }

    /**
     * Сбрасывает лимит
     * @number
     * @public
     */
    resetLimit(): void {
        this._limit = 0;
    }

    /**
     * Возвращается разнице между новым выбором newSelection и текущим
     * @param {ISelection} newSelection новый выбранные элементы
     * @return {ISelectionDifference}
     */
    getSelectionDifference(newSelection: ISelection): ISelectionDifference {
        const oldSelectedKeys = this._selection.selected;
        const oldExcludedKeys = this._selection.excluded;
        const newSelectedKeys = newSelection.selected;
        const newExcludedKeys = newSelection.excluded;
        const selectedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(
            oldSelectedKeys,
            newSelectedKeys
        );
        const excludedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(
            oldExcludedKeys,
            newExcludedKeys
        );

        const selectedKeysDifference: IKeysDifference = {
            keys: newSelectedKeys,
            added: selectedKeysDiff.added,
            removed: selectedKeysDiff.removed,
        };

        const excludedKeysDifference: IKeysDifference = {
            keys: newExcludedKeys,
            added: excludedKeysDiff.added,
            removed: excludedKeysDiff.removed,
        };

        return { selectedKeysDifference, excludedKeysDifference };
    }

    /**
     * Возвращает количество выбранных элементов
     * @param {ISelection} selection Список выбранных записей, по которому посчитаем кол-во выбранных элементов.
     * Если не передан то будет считать по состоянию контроллера
     */
    getCountOfSelected(selection?: ISelection): number | null {
        return this._counterController.getCount(
            this._limit,
            selection,
            this._filterChanged ? this._filter : null
        );
    }

    /**
     * Проверяет, что были выбраны все записи.
     * @param {boolean} [byEveryItem = true] true - проверять выбранность каждого элемента по отдельности.
     *  false - проверка происходит по наличию единого признака выбранности всех элементов.
     * @param {ISelection} selection Список выбранных записей, по которому посчитаем признак isAllSelected.
     * @param {CrudEntityKey} rootKey Корень, в котором считать признак isAllSelected.
     * @return {ISelection}
     */
    isAllSelected(
        byEveryItem: boolean = true,
        selection?: ISelection,
        rootKey?: CrudEntityKey
    ): boolean {
        return this._strategy.isAllSelected(
            selection || this._selection,
            this._model.hasMoreData(),
            this._model.getSourceCollection().getCount(),
            this._limit,
            byEveryItem,
            rootKey
        );
    }

    /**
     * Переключает состояние выбранности элемента
     * @param {CrudEntityKey} key Ключ элемента
     * @return {ISelection}
     */
    toggleItem(key: CrudEntityKey): ISelection {
        const item = this._model.getItemBySourceKey(key);
        if (!item.SelectableItem || item.isReadonlyCheckbox()) {
            return this._selection;
        }
        const status = item.isSelected();
        let newSelection;

        if (status === true || status === null) {
            if (this._limit) {
                // Если сняли выбор с элемента из пачки, то нужно уменьшить размер пачки
                if (!this._separatedSelectedItems.includes(key)) {
                    this._limit--;
                }
            }
            newSelection = this._strategy.unselect(this._selection, key, this._searchMode);
        } else {
            if (this._limit) {
                this._separatedSelectedItems.push(key);
            }
            newSelection = this._strategy.select(this._selection, key, this._searchMode);
        }

        this._lastCheckedKey = key;
        return newSelection;
    }

    setMassSelect(isMassSelect: boolean): void {
        this._strategy.setMassSelect?.(isMassSelect);
    }

    /**
     * Выбирает все элементы
     * @param packSize Размер пачки, которую нужно выбрать за этот раз. Увеличивает лимит на packSize.
     * @return {ISelection}
     */
    selectAll(packSize?: number): ISelection {
        let initSelection = this._filterChanged
            ? { selected: [], excluded: [] }
            : clone(this._selection);

        if (packSize) {
            initSelection = this._fillSelectionByLimit(initSelection, packSize);
        }

        const newSelection = this._strategy.selectAll(initSelection, this._limit);

        // Если передан packSize, но selection не изменился, то нужно сразу обновить модель
        if (packSize && isEqual(this._selection, newSelection)) {
            this._updateModel(this.getSelection());
        }
        this._startFilteredItemsCount = this._model.getSourceCollection().getCount();
        this._startFilter = this._filter;
        return newSelection;
    }

    /**
     * Переключает состояние выбранности у всех элементов
     * @return {ISelection}
     */
    toggleAll(): ISelection {
        return this._strategy.toggleAll(this._selection, this._model.hasMoreData());
    }

    /**
     * Снимает выбор со всех элементов
     * @return {ISelection}
     */
    unselectAll(): ISelection {
        return this._strategy.unselectAll(
            this._selection,
            this._filterChanged ? this._filter : null
        );
    }

    /**
     * Выбирает элементы с переданного ключа до предыдущего выбранного
     * @return {ISelection}
     */
    selectRange(key: CrudEntityKey): ISelection {
        if (key === this._lastCheckedKey) {
            return this._selection;
        }

        let newSelection;

        if (!this._lastCheckedKey) {
            newSelection = this.toggleItem(key);
        } else {
            const firstIndex = this._model.getIndexByKey(key);
            const secondIndex = this._model.getIndexByKey(this._lastCheckedKey);
            const sliceStart = secondIndex > firstIndex ? firstIndex : secondIndex;
            const sliceEnd = sliceStart === secondIndex ? firstIndex + 1 : secondIndex + 1;
            const items = [];
            for (let i = sliceStart; i < sliceEnd; i++) {
                // нельзя использовать ::getItems, т.к. он не учитывает фильтрацию, а ::getIndexByKey учитывает
                items.push(this._model.at(i));
            }

            newSelection = this._strategy.selectRange(items);
        }
        return newSelection;
    }

    /**
     * Обрабатывает удаление элементов из коллекции
     * @param {Array<ISelectionItem>} removedItems Удаленные элементы
     * @return {ISelection}
     */
    onCollectionRemove(removedItems: ISelectionItem[]): ISelection {
        if (this._model.getSourceCollection().getCount()) {
            let keys = this._getItemsKeys(removedItems);
            // Событие remove еще срабатывает при скрытии элементов, нас интересует именно удаление
            keys = keys.filter((key) => {
                return !this._model.getSourceDataStrategy().getSourceItemByKey(key);
            });

            const selected = ArraySimpleValuesUtil.removeSubArray(this._selectedKeys.slice(), keys);
            const excluded = ArraySimpleValuesUtil.removeSubArray(this._excludedKeys.slice(), keys);

            return { selected, excluded };
        } else {
            // Если удалили все записи, то и выбирать нечего
            return { selected: [], excluded: [] };
        }
    }

    /**
     * Обрабатывает сброс элементов в списке
     * @return {ISelection|void}
     */
    onCollectionReset(
        entryPath?: IEntryPathItem[],
        filter?: object,
        sorting?: object[]
    ): ISelection | void {
        this._updateFilterAndSorting(filter, sorting);

        // При смене фильтра, если выбраны все записи, то нужно сбрасывать selection
        // Также это нужно сделать, если сменилась сортировка при наличии лимита.
        // При лимите мы задаем selected=[null] и в excluded добавляем записи не попавшие в выбор,
        // поэтому если сменилась сортировка то мы выберем лишние записи.
        // Пересчитывать selection в этом кейсе не получится, т.к. пачка может быть больше чем загружено записей
        // и мы не знаем ключи всех выбранных записей.
        // Если нет данных для подгрузки, то не нужно сбрасывать selection,
        // т.к. с ограниченным набором данных мы сможем работать.
        const isAllSelected = this.isAllSelected(false);
        if (this._shouldResetSelectionOnReload(isAllSelected)) {
            return { selected: [], excluded: [] };
        }
        this._strategy.setEntryPath(entryPath);

        this._updateModel(this._selection);
    }

    /**
     * Обрабатывает добавление новых элементов в коллекцию
     * @param {Array<ISelectionItem>} newItems Новые элементы
     * @void
     */
    onCollectionReplace(newItems: ISelectionItem[]): void {
        this._updateModel(this._selection, false, newItems);
    }

    /**
     * Обрабатывает добавление новых элементов в коллекцию
     * @param {Array<ISelectionItem>} addedItems Новые элементы
     * @param addIndex Индекс куда добавили записи
     * @void
     */
    onCollectionAdd(addedItems: ISelectionItem[], addIndex: number): ISelection | void {
        if (this._limit) {
            const newSelection = clone(this._selection);
            let selectionChanged = false;
            // пробегаемся по добавленным записям и если они не выбраны лимитом, то закидываем их в excluded
            for (let i = 0; i < addedItems.length; i++) {
                const item = addedItems[i];
                const itemKey = this._getKey(item);
                const isSelectedByLimit = i + addIndex < this._limit;
                if (!isSelectedByLimit) {
                    selectionChanged = !newSelection.excluded.includes(itemKey);
                    ArraySimpleValuesUtil.addSubArray(newSelection.excluded, [itemKey]);
                }
            }

            // если selection не изменился, то сразу применяем его на список
            if (!selectionChanged) {
                this._updateModel(
                    this._selection,
                    false,
                    addedItems.filter((it) => {
                        return it.SelectableItem;
                    })
                );
            }

            return newSelection;
        } else {
            this._updateModel(
                this._selection,
                false,
                addedItems.filter((it) => {
                    return it.SelectableItem;
                })
            );
            this._selectedItems = this._strategy.getSelectedItems(
                this._selection,
                this._selectedItems
            );
        }
    }

    onCollectionMove(): void {
        // Если в дереве переместили записи в другой узел, то нужно обновить selection на модели, иначе на родителе
        // останется ненужная отметка, а на новом родителе не появится
        if (this._strategy instanceof TreeSelectionStrategy) {
            this._updateModel(this._selection);
        }
    }

    // region rightSwipe

    /**
     * Устанавливает текущее состояние анимации записи в false
     * @void
     */
    stopItemAnimation(): void {
        this._setAnimatedItem(null);
    }

    /**
     * Получает текущий анимированный элемент.
     * @void
     */
    getAnimatedItem(): ISelectionItem {
        return this._model.find((item) => {
            return !!item.isAnimatedForSelection && item.isAnimatedForSelection();
        });
    }

    /**
     * Активирует анимацию записи
     * @param itemKey
     * @void
     */
    startItemAnimation(itemKey: CrudEntityKey): void {
        this._setAnimatedItem(itemKey);
    }

    /**
     * Уничтожает все ссылки
     * @void
     */
    destroy(): void {
        // перед уничтожением контроллера, сбрасываем состояние на модели
        this._updateModel({ selected: [], excluded: [] });
        this._model = null;
        this._strategy = null;
        this._selectedKeys = null;
        this._excludedKeys = null;
        this._limit = null;
        this._searchMode = null;
        this._filter = null;
    }

    /**
     * Устанавливает текущее состояние анимации записи по её ключу
     * @param key
     * @private
     */
    private _setAnimatedItem(key: CrudEntityKey): void {
        const oldSwipeItem = this.getAnimatedItem();
        const newSwipeItem = this._model.getItemBySourceKey(key);

        if (oldSwipeItem) {
            oldSwipeItem.setAnimatedForSelection(false);
        }
        if (newSwipeItem) {
            newSwipeItem.setAnimatedForSelection(true);
        }
    }

    // endregion

    private _getItemsKeys(items: ISelectionItem[]): TKeys {
        return items
            .filter((it) => {
                return it.SelectableItem;
            })
            .map((item) => {
                return this._getKey(item);
            });
    }

    private _fillSelectionByLimit(selection: ISelection, packSize: number): ISelection {
        const newSelection = clone(selection);

        const firstSelectPack = !this._limit;
        if (packSize) {
            this._limit += packSize;
        }

        if (this._limit) {
            const items = this._model.getItems().filter((it) => {
                return it.SelectableItem;
            });

            if (firstSelectPack) {
                // Если выбор первой пачки, то бежим по всем элементам, чтобы в excluded закинуть
                // все не выбранные записи.
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const itemKey = this._getKey(item);
                    const isSelectedByLimit = i < this._limit;
                    if (item.isSelected()) {
                        if (isSelectedByLimit) {
                            // если элемент входит в пачку и уже был до этого выбран,
                            // то добавляем его в пачку увеличивая размер самой пачки
                            this._limit++;
                        } else {
                            this._separatedSelectedItems.push(itemKey);
                        }
                    }
                    if (!isSelectedByLimit && !item.isSelected()) {
                        ArraySimpleValuesUtil.addSubArray(newSelection.excluded, [itemKey]);
                    }
                }
            } else {
                let countSelected = 0;
                // Могли снять точечно отметки с записи из пачки, поэтмоу пробегаемся по прошлой пачке
                // и если нужно ставим отметку на невыбранные записи
                for (let i = 0; i < this._limit - packSize && i < items.length; i++) {
                    const item = items[i];
                    const itemKey = this._getKey(item);
                    if (!item.isSelected()) {
                        ArraySimpleValuesUtil.removeSubArray(newSelection.excluded, [itemKey]);
                        countSelected++;
                    }
                }

                const currentPackIsFilled = countSelected === packSize;
                if (!currentPackIsFilled) {
                    // Проходим по новой пачке
                    for (let i = this._limit - packSize; i < this._limit && i < items.length; i++) {
                        const item = items[i];
                        const itemKey = this._getKey(item);
                        const isSelectedByLimit = i < this._limit;
                        if (isSelectedByLimit) {
                            if (this._separatedSelectedItems.includes(itemKey)) {
                                // если элемент был выбран отдельно пачки, то его добавляем в пачку увеличивая размер пачки
                                this._limit++;
                            }
                            ArraySimpleValuesUtil.removeSubArray(newSelection.excluded, [itemKey]);
                        } else {
                            ArraySimpleValuesUtil.addSubArray(newSelection.excluded, [itemKey]);
                        }
                    }
                }
            }
        }

        return newSelection;
    }

    private _updateModel(
        selection: ISelection,
        silent: boolean = false,
        items?: ISelectionItem[]
    ): void {
        let limit = this._limit;
        // Если есть лимит, то при обработке дозагруженных элементов мы должны обработать не все записи,
        // а только то кол-во, которое не хватает до лимита
        if (this._limit && items) {
            let countSelectedItems = 0;
            this._model.each((it) => {
                return it.isSelected() ? countSelectedItems++ : null;
            });
            limit = limit - countSelectedItems;
        }

        const selectionForModel = this._strategy.getSelectionForModel(
            selection,
            limit,
            this._searchMode
        );

        // TODO думаю лучше будет занотифаить об изменении один раз после всех вызовов (сейчас нотифай в каждом)
        // https://online.sbis.ru/opendoc.html?guid=492628c5-651d-4a3d-ba57-4bcf702c594a
        selectionForModel.forEach((selectedItems, selected) => {
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                if (selectedItems[i].isSelected() !== selected) {
                    selectedItems[i].setSelected(selected, silent);
                }
            }
        });
    }

    private _shouldResetSelectionOnReload(isAllSelected: boolean): boolean {
        const returnedStartedFilter = isEqual(this._startFilter, this._filter);
        // Если при перезагрузке выборка записей стала больше, то нужно сбрасывать selection
        const loadedItemsMoreStartLoadedItems =
            this._startFilteredItemsCount < this._model.getSourceCollection().getCount();
        const resetByFilter =
            this._filterChanged &&
            !returnedStartedFilter &&
            (this._model.hasMoreData() || loadedItemsMoreStartLoadedItems);
        const resetBySorting = this._sortingChanged && !!this._limit;
        return (resetByFilter && isAllSelected) || resetBySorting;
    }

    private _updateFilterAndSorting(filter?: object, sorting?: object[]): void {
        // Запоминаем изменение фильтра или сортировки, только если есть выбранные записи.
        const hasSelection = !!this._selection.selected.length;
        if (!isEqual(this._filter, filter)) {
            this._filter = filter;
            this._filterChanged = hasSelection;
        }
        if (!isEqual(this._sorting, sorting)) {
            this._sorting = sorting;
            this._sortingChanged = hasSelection;
        }
    }

    /**
     * @private
     * TODO нужно выпилить этот метод при переписывании моделей. item.getContents() должен возвращать Record
     *  https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
     */
    private _getKey(item: ISelectionItem): CrudEntityKey {
        if (!item) {
            return undefined;
        }

        let contents = item.getContents();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (item['[Controls/_baseTree/BreadcrumbsItem]'] || item.breadCrumbs) {
            // eslint-disable-next-line
            contents = contents[(contents as any).length - 1];
        }

        return contents instanceof Object ? contents.getKey() : contents;
    }
}
