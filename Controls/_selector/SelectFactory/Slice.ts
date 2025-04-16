import { Slice } from 'Controls-DataEnv/slice';
import { RecordSet, List } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';
import { ISelectorTabsConfigs } from 'Controls/_selector/interfaces/ISelector';
import { ISelectFactoryLoadResults } from 'Controls/_selector/SelectFactory/loadData';
import ISelectFactoryArguments from 'Controls/_selector/interfaces/ISelectFactoryArguments';
import { Model } from 'Types/entity';
import type { TKey } from 'Controls-DataEnv/interface';
import { getListConfigs, getListResults, loadTabDeps } from './Utils';
import { loadHistoryItems } from './History/loadHistoryItems';
import Utils from 'Controls/lookupUtils';
import { IListState } from 'Controls/dataFactory';
import { factory } from 'Types/chain';

/**
 * Интерфейс состояния слайса окна выбора
 * @public
 */
export interface ISelectSliceState {
    /**
     * Определяет, изменён ли выбор на окне
     */
    isSelectionChanged: boolean;
    /**
     * История выбора
     */
    history?: Record<string, RecordSet>;
    /**
     * Идентификатор активной вкладки на окне выбора
     */
    selectedTabKey: CrudEntityKey;
    /**
     * Коллекция выбранных записей
     */
    selectedItems: Record<string, RecordSet<Model> | List<Model>>;
    /**
     * Конфигурация вкладок
     */
    configs: ISelectorTabsConfigs;
    /**
     * Определяет, включён ли множественный выбор
     */
    multiSelect: boolean;
    /**
     * Флаг, определяющий инициирование применения данных
     */
    submitActivated: boolean;
    /**
     * Объект, содержащий результаты загрузки списочных слайсов в окне выбора
     */
    listResults: ISelectFactoryLoadResults['listResults'];
    /**
     * Объект, содержащий настройки для загрузки списочных слайсов в окне выбора
     */
    listConfigs: ISelectFactoryLoadResults['listConfigs'];
    /**
     * Оюбъект, содержащий сохранненые и запиненные записи для каждой вкладки
     */
    historyItems: ISelectFactoryLoadResults['historyItems'];
}

/**
 * Интерфейс слайса окна выбора
 * @private
 */
export interface ISelectSlice {
    /**
     * Подтвердить выбор на окне выбора
     */
    submit(): Promise<unknown>;
    /**
     * Отметить запись
     */
    select(listName: string, item: Model): void;
    /**
     * Исключить из отмеченных
     */
    exclude(listName: string, item: Model): void;
    /**
     * Переключить вкладку и загрузить данные для нее
     */
    setCurrentTab(listName: string): void;
    /**
     * Обновить видимость кнопки выбора исходя из выбранных значений
     */
    updateSelectionChangedState(listName: string, selectedKeys: TKey[]): void;
    /**
     * Загрузить выбранные записи для вкладки
     */
    addSelectLoadByConfig(listName: string, config: IListState): Promise<void>;
}

/**
 * Контроллер (слайс) окна выбора
 * @public
 */
export default class SelectSlice extends Slice<ISelectSliceState> {
    _configSelectedItems: RecordSet<Model> | List<Model> | undefined;
    _initialSelectedItems: Record<string, RecordSet<Model> | List<Model>>;
    _loadingItems: Record<string, Promise<RecordSet | undefined>> = {};
    _submitPromise: Function;

    protected _initState(
        loadResults: ISelectFactoryLoadResults,
        config: ISelectFactoryArguments
    ): ISelectSliceState {
        const { selectedTabKey, listConfigs, listResults, historyItems } = loadResults;
        this._configSelectedItems = config.selectedItems;
        const selectedItems = this._getSelectedItems(
            config.configs,
            loadResults.listResults,
            selectedTabKey,
            config.selectedItems
        );
        this._initialSelectedItems = this._getSelectedItemsCopy(selectedItems);
        return {
            ...super._initState(listResults, config),
            selectedItems,
            isSelectionChanged: false,
            selectedTabKey,
            configs: config.configs,
            multiSelect: !!config.multiSelect,
            listResults,
            listConfigs,
            historyItems,
            submitActivated: false,
        };
    }

    protected _beforeApplyState(
        nextState: ISelectSliceState
    ): Promise<ISelectSliceState> | ISelectSliceState {
        const selectedItemsChanged = !Object.keys(nextState.selectedItems).every((key) => {
            return nextState.selectedItems[key].isEqual(this.state.selectedItems[key]);
        });
        if (selectedItemsChanged) {
            nextState.isSelectionChanged = this._getIsSelectedItemsChanged(nextState.selectedItems);
        }
        return super._beforeApplyState(nextState);
    }

    /**
     * Инициирует выбор в окне
     * @remark При отсутствии переданных аргументов получает выбранные записи, загружая данные из списочных слайсов
     * @param item? Выбранная запись
     * @param listConfig? Текущее состояние списочного слайса, элементом которого является выбранная запись
     * @return {RecordSet | List<Model>}
     * */
    async submit(item?: Model, listConfig?: IListState): Promise<RecordSet | List<Model>> {
        if (item) {
            const listName = this.state.selectedTabKey;
            if (this.state.multiSelect) {
                const listItemConfig = {
                    ...listConfig,
                    selectedKeys: [item.getKey()],
                } as IListState;
                return (await this._getSelectLoadedItems(
                    listName as string,
                    listItemConfig
                )) as RecordSet;
            }
            return this._getResultSelectedItems(item);
        }
        this.setState({
            submitActivated: true,
        });
        return new Promise((resolve) => {
            this._submitPromise = resolve;
        });
    }

    /**
     * Добавляет запись в список выбранных
     * @param listName Имя вкладки в конфигурации окна выбора
     * @param item Добавляемая запись
     * */
    select(listName: string, item: Model) {
        const newSelectedItems = { ...this.state.selectedItems };
        newSelectedItems[listName] = newSelectedItems[listName].clone();
        newSelectedItems[listName].add(item);
        this.setState({
            selectedItems: newSelectedItems,
        });
    }

    /**
     * Удаляет запись из выбранных
     * @param listName Имя вкладки в конфигурации окна выбора
     * @param item Удаляемая запись
     * */
    exclude(listName: string, item: Model) {
        const newSelectedItems = { ...this.state.selectedItems };
        newSelectedItems[listName] = newSelectedItems[listName].clone();
        newSelectedItems[listName].remove(this._getRemovingItem(listName, newSelectedItems, item));
        this.setState({
            selectedItems: newSelectedItems,
        });
    }

    private _getRemovingItem(
        listName: string,
        selectedItems: Record<string, RecordSet<Model> | List<Model>>,
        removingItem: Model
    ): Model {
        const removingRecordIndex = selectedItems[listName].getIndexByValue(
            removingItem.getKeyProperty(),
            removingItem.getKey()
        );
        return selectedItems[listName].at(removingRecordIndex);
    }

    /**
     * Обновляет видимость кнопки выбора исходя из выбранных значений
     * @param listName Имя вкладки в конфигурации окна выбора
     * @param selectedKeys Массив текущих выбранных записей
     * */
    updateSelectionChangedState(listName: string, selectedKeys: TKey[]): void {
        this.setState({
            isSelectionChanged: this._getIsSelectionChangedBySelectedKeys(
                this._initialSelectedItems?.[listName],
                selectedKeys
            ),
        });
    }

    /**
     * Загружает выбранные записи для вкладки
     * @param listName Имя вкладки в конфигурации окна выбора
     * @param config Текущее состояние списочного слайса
     * */
    async addSelectLoadByConfig(listName: string, config: IListState): Promise<void> {
        this._loadingItems[listName] = this._getSelectLoadedItems(listName, config);
        if (Object.keys(this._loadingItems).length === Object.keys(this.state.listResults).length) {
            Promise.all(Object.values(this._loadingItems)).then(async (result) => {
                const loadedItems = await this._onSelectionLoad(listName, result as RecordSet[]);
                this._submitPromise(this._getSelectedItemsFromLoadData(loadedItems));
            });
        }
    }

    private _getSelectedItemsFromLoadData(loadedItems: RecordSet[]): RecordSet | undefined {
        let selectedItems: RecordSet | undefined;
        Object.values(loadedItems).forEach((items) => {
            if (!selectedItems) {
                selectedItems = items.clone();
            } else {
                selectedItems.append(items);
            }
        });
        return selectedItems;
    }

    private async _getSelectLoadedItems(
        listName: string,
        config: IListState
    ): Promise<RecordSet | undefined> {
        const listConfig = {
            ...config,
            ...(await this._beforeSelectionLoad(listName, config)),
        };
        return Utils.selectComplete(
            listConfig,
            this.state.configs[listName].selectionType,
            this.state.multiSelect
        );
    }

    /**
     * Переключает вкладку и загружает данные для нее
     * @param listName Имя вкладки в конфигурации окна выбора
     * */
    async setCurrentTab(listName: string) {
        if (!this.state.listResults[listName]) {
            Promise.all([
                getListConfigs(this.state.configs, listName, this.state.multiSelect),
                loadTabDeps(this.state.configs[listName], this.state.multiSelect),
            ]).then(async (result) => {
                const listConfigs = {
                    ...this.state.listConfigs,
                    [listName]: result[0],
                } as ISelectFactoryLoadResults['listConfigs'];

                const listResults = {
                    ...this.state.listResults,
                    [listName]: await getListResults(listConfigs[listName]),
                };

                const historyItems = {
                    ...this.state.historyItems,
                    [listName]: await loadHistoryItems(
                        this.state.configs[listName],
                        listResults.listName,
                        listName
                    ),
                } as ISelectFactoryLoadResults['historyItems'];

                this.setState({
                    listConfigs,
                    listResults,
                    historyItems,
                    selectedTabKey: listName,
                });
            });
        } else {
            this.setState({ selectedTabKey: listName });
        }
    }

    /**
     * Метод, вызываемый перед загрузкой выбранных записей
     * @param _listName Имя вкладки в конфигурации окна выбора
     * @param config Текущее состояние списочного слайса
     * @return Promise<IListState>
     */
    protected _beforeSelectionLoad(_listName: string, config: IListState): Promise<IListState> {
        return Promise.resolve(config);
    }

    /**
     * Метод, вызываемый перед сохранением выбранных записей
     * @param _listName Имя вкладки в конфигурации окна выбора
     * @param loadedItems Загруженные записи
     * @return Promise<RecordSet[]>
     */
    protected _onSelectionLoad(_listName: string, loadedItems: RecordSet[]): Promise<RecordSet[]> {
        return Promise.resolve(loadedItems);
    }

    private _getResultSelectedItems(item: Model): RecordSet<Model> | List<Model> {
        if (this._configSelectedItems) {
            const resultSelectedItems = this._configSelectedItems.clone() as
                | RecordSet<Model>
                | List<Model>;
            resultSelectedItems.clear();
            resultSelectedItems.add(item);
            return resultSelectedItems;
        }
        return new List({
            items: [item],
        });
    }

    private _getIsSelectedItemsChanged(
        selectedItems: Record<string, RecordSet<Model> | List<Model>>
    ): boolean {
        return Object.keys(this.state.configs).some((key) => {
            let selectionChanged = false;
            const { storeId } = this.state.configs[key];
            if (
                selectedItems[storeId].getCount() === this._initialSelectedItems[storeId].getCount()
            ) {
                selectedItems[storeId].each((item) => {
                    const selectedStoreId = this.state.configs[this.state.selectedTabKey].storeId;
                    const { keyProperty } =
                        this.state.listResults[this.state.selectedTabKey][selectedStoreId];
                    const removingRecordIndex = this._initialSelectedItems[storeId].getIndexByValue(
                        keyProperty as string,
                        item.getKey()
                    );
                    if (removingRecordIndex === -1) {
                        selectionChanged = true;
                    }
                });
                return selectionChanged;
            }
            return !!(
                this._initialSelectedItems[storeId].getCount() || selectedItems[storeId].getCount()
            );
        });
    }

    private _getIsSelectionChangedBySelectedKeys(
        initialItems: RecordSet<Model> | List<Model> | undefined,
        selectedKeys: TKey[]
    ): boolean {
        if (selectedKeys.length === initialItems?.getCount()) {
            return !selectedKeys.every((key) => {
                const storeId = this.state.configs[this.state.selectedTabKey].storeId;
                const { keyProperty } = this.state.listResults[this.state.selectedTabKey][storeId];
                const removingRecordIndex = initialItems.getIndexByValue(
                    keyProperty as string,
                    key
                );
                return initialItems.at(removingRecordIndex);
            });
        }
        return !!initialItems || !!selectedKeys.length;
    }

    private _getInitialSelectedItems(
        tabKeys: string[],
        configs: ISelectorTabsConfigs
    ): Record<string, List<Model>> {
        const initialSelectedItems = {} as Record<string, List<Model>>;
        tabKeys.forEach((key) => {
            const listStoreId = configs[key].storeId;
            initialSelectedItems[listStoreId] = new List({
                items: [] as Model[],
            });
        });
        return initialSelectedItems;
    }

    private _getSelectedItems(
        configs: ISelectorTabsConfigs,
        listResults: ISelectFactoryLoadResults['listResults'],
        selectedTabKey: CrudEntityKey,
        selectedItemsConfig?: RecordSet<Model> | List<Model>
    ): Record<string, RecordSet<Model> | List<Model>> {
        const tabKeys = Object.keys(configs);
        const listStoreId = configs[selectedTabKey].storeId;
        const listData = listResults[selectedTabKey][listStoreId];
        const selectedItems = this._getInitialSelectedItems(tabKeys, configs);
        if (selectedItemsConfig) {
            if (tabKeys.length > 1) {
                Object.keys(configs).forEach((key) => {
                    const listStoreId = configs[key].storeId;
                    const selectionFilter = configs[key].selectionFilter as (
                        item: Model,
                        index: number
                    ) => boolean;
                    if (selectionFilter) {
                        selectedItems[listStoreId].append(
                            factory(selectedItemsConfig).filter(selectionFilter).value()
                        );
                    } else {
                        selectedItems[listStoreId].append(
                            factory(selectedItemsConfig)
                                .filter((item) => {
                                    const listItems = listData.items as RecordSet;
                                    const currentTabItem = listItems.getRecordById(item.getKey());
                                    return currentTabItem
                                        ? key === selectedTabKey
                                        : key !== selectedTabKey;
                                })
                                .value()
                        );
                    }
                });
            } else {
                const listStoreId = configs[selectedTabKey].storeId;
                return {
                    [listStoreId]: selectedItemsConfig,
                } as Record<string, RecordSet<Model>>;
            }
        }
        return selectedItems;
    }

    private _getSelectedItemsCopy(
        selectedItems: Record<string, RecordSet<Model> | List<Model>>
    ): Record<string, RecordSet<Model> | List<Model>> {
        const selectedItemsCopy = { ...selectedItems };
        for (const key in selectedItemsCopy) {
            if (selectedItemsCopy[key]) {
                selectedItemsCopy[key] = selectedItemsCopy[key].clone();
            }
        }
        return selectedItemsCopy;
    }
}
