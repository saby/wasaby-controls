/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_filterPopup/SimplePanel/SimplePanel';
import * as defaultItemTemplate from 'wml!Controls/_filterPopup/SimplePanel/itemTemplate';

import { factory } from 'Types/chain';
import { RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import { IFilterItem, HistoryUtils } from 'Controls/filter';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { TMenuConfig, IMenuControlOptions } from 'Controls/menu';
import { Model } from 'Types/entity';
import { List } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';
import { TKey } from 'Controls/interface';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import 'css!Controls/filterPopup';
import 'css!Controls/menu';

interface ISimplePanelOptions extends IControlOptions {
    itemTemplate: TemplateFunction;
    items: RecordSet;
}

const DEFAULT_MIN_VISIBLE_ITEMS = 2;
const COUNT_OF_ITEMS_FOR_SEARCH = 10;
const SEARCH_GRID_COLLECTION = 'Controls/searchBreadcrumbsGrid';
const DATE_MENU_TEMPLATE = 'Controls/filterPanelEditors:DateMenu';
const MENU_ITEM_PADDING = {
    right: 'menu-close',
};
const EMPTY_ITEM_NAME = '_emptyItem';

/**
 * Панель "быстрых фильтров" для {@link Controls/filter:View}.
 * Шаблон окна, в котором для каждого фильтра с viewMode = 'frequent' отображает список элементов в отдельном блоке.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_filterPopup.less переменные тем оформления}
 *
 * @class Controls/_filterPopup/SimplePanel
 * @extends UI/Base:Control
 * @public
 *
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.filterPopup:SimplePanel
 *     attr:class="custom-SimplePanel"
 *     items="{{_options.items}}" />
 * </pre>
 *
 */

/*
 * Control dropdown list for {@link Controls/filter:View}.
 *
 * @class Controls/_filterPopup/SimplePanel
 * @extends UI/Base:Control
 * @mixes Controls/_filterPopup/SimplePanel/SimplePanelStyles
 *
 * @public
 * @author Михайлов С.Е.
 *
 */
class Panel extends Control<ISimplePanelOptions> {
    protected _template: TemplateFunction = template;
    protected _menuConfigs: TMenuConfig;
    protected _dateMenuItem: IFilterItem;
    protected _folders: Record<string, string[]> = {};
    protected _selectedKeys: Record<string, string[]> = {};
    protected _applyButtonVisible: boolean;
    protected _hasSearchInput: boolean;
    protected _hasMenuConfigs: boolean;
    protected _emptyItemFontWeight: string;
    protected _searchValue: string;
    protected _searchHeaderConfig: Object;
    protected _minWidth: number;
    protected _minHeight: number;

    protected _beforeMount(options: ISimplePanelOptions): Promise<void> {
        return this._getMenuMultipleConfig(options.items).then((items) => {
            this._menuConfigs = items;
            const menuKeys = Object.keys(this._menuConfigs);
            menuKeys.forEach((name) => {
                this._selectedKeys[name] = this._menuConfigs[name].initSelectedKeys;
            });
            this._hasMenuConfigs = !!menuKeys.length;
            this._emptyItemFontWeight = this._getEmptyItemFontWeight();
            this._hasSearchInput = this._hasSearch(this._menuConfigs, this._dateMenuItem);
            if (this._hasSearchInput) {
                const item = Object.values(this._menuConfigs)[0];
                this._searchHeaderConfig = {
                    minSearchLength: item.minSearchLength,
                    searchDelay: item.searchDelay,
                    searchParam: item.searchParam,
                    searchPlaceholder: item.searchPlaceholder,
                    isAdaptive: item.isAdaptive,
                };
                return loadAsync(SEARCH_GRID_COLLECTION);
            }
        });
    }

    protected _beforeUpdate(newOptions: ISimplePanelOptions): Promise<void> {
        const itemsChanged = newOptions.items !== this._options.items;
        if (itemsChanged) {
            return this._getMenuMultipleConfig(newOptions.items).then((items) => {
                this._menuConfigs = items;
                Object.keys(this._menuConfigs).forEach((name) => {
                    if (
                        this._menuConfigs[name].selectedKeys !==
                        this._menuConfigs[name].initSelectedKeys
                    ) {
                        this._selectedKeys[name] = this._menuConfigs[name].selectedKeys;
                    }
                });
                this._applyButtonVisible = this._needShowApplyButton(this._menuConfigs);
                this._emptyItemFontWeight = this._getEmptyItemFontWeight();
            });
        }
    }

    protected _afterMount() {
        if (this._options.isAdaptive && this._hasSearchInput) {
            this._minWidth = this._children.contentTemplate?._container.clientWidth;
            this._minHeight = this._children.contentTemplate?._container.clientHeight;
        }
    }

    protected _itemClickDateMenuHandler(event: Event, keys: string[], textValue: string): void {
        if (!this._options.readOnly && !this._dateMenuItem.readOnly) {
            if (!isEqual(this._dateMenuItem.selectedKeys, keys)) {
                const result = {
                    action: 'itemClick',
                    selectedKeys: keys,
                    textValue,
                    name: this._dateMenuItem.name,
                    searchValue: this._searchValue,
                };
                this._notify('sendResult', [result]);
            } else {
                this._notify('sendResult', [{ action: 'menuClosed' }]);
            }
        }
    }

    protected _itemClickHandler(
        event: Event,
        item: Model,
        sourceEvent: SyntheticEvent<MouseEvent>,
        name
    ) {
        const filterItem = this._menuConfigs[name];
        if (!this._options.readOnly && !filterItem.readOnly) {
            const keys = [item.get(filterItem.keyProperty)];
            const selectedKeys = filterItem.nodeProperty ? { [filterItem.name]: keys } : keys;
            if (
                (this._isOnMarkerClicked(sourceEvent) && item.getKey() !== filterItem.emptyKey) ||
                this._isAnyItemSelected(name)
            ) {
                this._selectedKeysChanged(
                    event,
                    {
                        ...this._selectedKeys,
                        [name]: keys,
                    },
                    name
                );
            } else if (!isEqual(filterItem.initSelectedKeys, selectedKeys)) {
                const folderFilterName = this._getFolderFilterName(name);
                const result = {
                    action: 'itemClick',
                    selectedKeys,
                    textValue: item.get(filterItem.displayProperty),
                    name: folderFilterName || name,
                    searchValue: this._searchValue,
                };
                this._notify('sendResult', [result]);
            } else {
                this._notify('sendResult', [{ action: 'menuClosed' }]);
            }
        }
    }

    private _isOnMarkerClicked(sourceEvent: SyntheticEvent<MouseEvent>): boolean {
        return !!sourceEvent?.target?.closest('.controls-Menu__row-radioCircle');
    }

    private _isAnyItemSelected(itemName: string): boolean {
        return Object.values(this._menuConfigs)?.some((item) => {
            if (item.name === itemName) {
                return false;
            }
            if (item.initSelectedKeys instanceof Array) {
                return !this._isEqualKeys(item.initSelectedKeys, this._selectedKeys[item.name]);
            }
            if (this._hasFolders() && this._menuConfigs[itemName].nodeProperty) {
                const hierarchyNames = Object.values(this._folders).find((nameFolderArr) =>
                    nameFolderArr.includes(itemName)
                );
                hierarchyNames.every((name) => {
                    if (!name.includes(EMPTY_ITEM_NAME)) {
                        return this._isEqualKeys(
                            this._selectedKeys[name],
                            item.initSelectedKeys[name]
                        );
                    }
                    return true;
                });
            }
        });
    }

    protected _selectedKeysChanged(
        event: SyntheticEvent<Event>,
        keys: string[],
        name: string
    ): void {
        this._selectedKeys = keys;
        const newConfigs = {};
        let changedNames = [name];
        let emptyItem;
        if (this._hasFolders() && this._menuConfigs[name].nodeProperty) {
            // Имена всех меню, входящих в состав иерархического фильтра
            changedNames = Object.values(this._folders).find((nameFolderArr) =>
                nameFolderArr.includes(name)
            );
            changedNames.find((changedName) => {
                if (changedName.includes(EMPTY_ITEM_NAME)) {
                    // Ищем меню с пустым элементом, ему всегда нужно проставлять новый ключ, чтобы снять маркер
                    emptyItem = this._menuConfigs[changedName];
                    this._selectedKeys[emptyItem.name] = keys[name];
                    return emptyItem;
                }
            });
            // Если ткнули в пустой элемент
            if (this._selectedKeys[emptyItem.name].includes(emptyItem.emptyKey)) {
                changedNames.forEach((cName) => {
                    if (emptyItem.name !== cName) {
                        this._selectedKeys[cName] = [emptyItem.emptyKey];
                    }
                });
            } else if (!this._selectedKeys[name].length) {
                this._selectedKeys[name] = [emptyItem.emptyKey];
            }

            const isAllReseted = changedNames.every((cName) => {
                return (
                    (!this._selectedKeys[cName]?.length ||
                        this._selectedKeys[cName].includes(emptyItem.emptyKey)) &&
                    emptyItem.emptyText
                );
            });
            if (isAllReseted) {
                changedNames.forEach((cName) => {
                    const changedItem = emptyItem || this._menuConfigs[cName];
                    // Если все меню иерархического фильтра сброшены, проставляем emptyKey фильтра
                    this._selectedKeys[cName] =
                        changedItem.emptyKey !== undefined ? [changedItem.emptyKey] : [];
                });
            }
        }
        Object.keys(this._selectedKeys).forEach((menuName) => {
            // Обновление всех меню, входящих в состав иерархического фильтра
            if (changedNames.includes(menuName)) {
                newConfigs[menuName] = {
                    ...this._menuConfigs[menuName],
                    markedKey: this._selectedKeys[menuName][0] ?? null,
                };
            } else {
                newConfigs[menuName] = this._menuConfigs[menuName];
            }
        });
        this._menuConfigs = newConfigs;
        this._applyButtonVisible = this._needShowApplyButton(this._menuConfigs, this._selectedKeys);
    }

    protected _search(event, value: string): void {
        const name = Object.keys(this._menuConfigs)[0];
        const item = this._menuConfigs[name];
        const controllerFilter = item.sourceController.getFilter() || {};
        let filter;
        if (value) {
            filter = {
                ...controllerFilter,
                [item.searchParam]: value,
            };
        } else {
            filter = { ...controllerFilter };
            delete filter[item.searchParam];
        }
        item.sourceController.load(undefined, undefined, filter).then(() => {
            const newMenuConfig = {
                ...this._menuConfigs[name],
                viewMode: value ? 'search' : undefined,
                searchValue: value,
            };
            this._menuConfigs = {
                [name]: newMenuConfig,
            };
            this._searchValue = value;
        });
    }

    protected _moreButtonHierarchyClick(name): void {
        const selectedItems = [];
        const menuConfig = this._menuConfigs[name];

        this._selectedKeys[name].forEach((key) => {
            if (key !== undefined && key !== null && menuConfig.selectorItems.getRecordById(key)) {
                selectedItems.push(menuConfig.selectorItems.getRecordById(key));
            }
        });

        this._moreButtonClick(
            new SyntheticEvent(null, {
                type: 'moreButtonClick',
            }),
            new List({ items: selectedItems }),
            name,
            Object.keys(this._folders).find((folder) => this._folders[folder].includes(name))
        );
    }

    protected _moreButtonClick(
        event: SyntheticEvent<Event>,
        selectedItems: List,
        name: string,
        hierarchyName?: string
    ): void {
        const item = this._menuConfigs[name];
        const selectorTemplate = item.selectorTemplate;
        const selectorOpener =
            item.selectorTemplate.mode === 'dialog' ? item.dialogOpener : item.selectorOpener;
        const selectorDialogResult = item.selectorDialogResult;
        const selectorDialogClose = item.selectorDialogClose;
        const templateConfig = {
            selectedItems,
            searchValue: this._searchValue,
            multiSelect: item.multiSelect,
            handlers: {
                onSelectComplete: (event, result) => {
                    selectorDialogResult(result);
                    selectorOpener.close();
                    selectorDialogClose();
                },
            },
        };
        selectorOpener.open({
            opener: item.opener,
            eventHandlers: {
                onResult: selectorDialogResult,
                onClose: selectorDialogClose,
            },
            templateOptions: { ...templateConfig, ...selectorTemplate.templateOptions },
            template: selectorTemplate.templateName,
            isCompoundTemplate: item.isCompoundTemplate,
            ...selectorTemplate.popupOptions,
        });

        this._afterOpenDialogCallback(templateConfig.selectedItems, hierarchyName || name);
    }

    private _afterOpenDialogCallback(selectedItems: Model[], name: string): void {
        this._notify('sendResult', [
            {
                action: 'moreButtonClick',
                name,
                selectedItems,
                searchValue: this._searchValue,
            },
        ]);
    }

    protected _closeClick(): void {
        this._notify('close');
    }

    protected _applySelection(event: Event): void {
        const result = this._getResult(event, 'applyClick');
        this._notify('sendResult', [result]);
    }

    private _getFolderFilterName(name: string): string | void {
        if (this._hasFolders() && this._menuConfigs[name].nodeProperty) {
            return Object.keys(this._folders).find((key) => this._folders[key].includes(name));
        }
    }

    private _getMenuMultipleConfig(initItems: RecordSet): Promise<TMenuConfig> {
        let items = [];
        const loadPromises = [];
        factory(initItems).each((item, index) => {
            const curItem = item.getRawData();
            if (curItem.editorTemplateName === DATE_MENU_TEMPLATE) {
                this._dateMenuItem = curItem;
            } else {
                if (curItem.loadDeferred) {
                    loadPromises.push(
                        curItem.loadDeferred.addCallback(() => {
                            if (HistoryUtils.isHistorySource(curItem.source)) {
                                curItem.items = curItem.source.prepareItems(curItem.items);
                                curItem.hasMoreButton =
                                    curItem.sourceController.hasMoreData('down');
                            }
                        })
                    );
                }
                const curItems = this._getMenuConfig(
                    curItem,
                    index === initItems.getCount() - 1,
                    items.length ? items[items.length - 1].order + 1 : 0
                );
                items = items.concat(curItems);
            }
        });
        return Promise.all(loadPromises).then(() => {
            const displayItems = items.filter((item) => {
                const minVisibleItems =
                    item.minVisibleItems !== undefined
                        ? item.minVisibleItems
                        : DEFAULT_MIN_VISIBLE_ITEMS;
                const frequentItems = item.dateMenuItems || item.items;
                let itemsCount = frequentItems?.getCount();
                if (item.editorTemplateName === 'Controls/filterPanelEditors:DateMenu') {
                    itemsCount += 1;
                }
                return itemsCount >= minVisibleItems || item.hasMoreButton;
            });
            const resultItems = displayItems.length ? displayItems : items.length ? [items[0]] : [];
            const menuConfigs: TMenuConfig = {};
            resultItems.forEach((item) => {
                menuConfigs[item.name] = item;
            });
            return menuConfigs;
        });
    }

    private _getMenuConfig(curItem, isLast: boolean, menuItemIndex: number): IMenuControlOptions[] {
        let folders;
        if (curItem.nodeProperty) {
            folders = this._getFolders(curItem);
        }
        if (curItem.nodeProperty && folders?.length) {
            let result: IMenuControlOptions[] = [];

            this._folders[curItem.name] = folders.map((folder) => String(folder.name));

            if (curItem.emptyText) {
                const emptyName = curItem.name + EMPTY_ITEM_NAME;
                this._folders[curItem.name].push(emptyName);
                result = this._prepareItemMenuOptions(
                    {
                        ...curItem,
                        name: emptyName,
                        minVisibleItems: 0, // Для проверки на видимость быстрого фильтра
                        multiSelect: false,
                        items: new RecordSet({
                            rawData: [],
                            keyProperty: curItem.keyProperty,
                        }),
                        sourceController: undefined,
                        source: undefined,
                        emptyTemplate: undefined,
                        searchParam: undefined,
                        order: menuItemIndex++,
                    },
                    false
                ).concat(result);
            }
            folders.forEach((folder, index) => {
                const keyProperty = curItem.keyProperty;
                const parentProperty = curItem.parentProperty;
                folder.emptyKey = folder.name;
                folder.hasMoreButton = folder.sourceController.hasMoreData('down', folder.name);
                folder.order = menuItemIndex++; // Порядок фильтров в объекте _menuConfigs может измениться
                const items = factory(curItem.items)
                    .filter((item) => {
                        return item.get(parentProperty) === folder.name;
                    })
                    .value();
                const records = new RecordSet({
                    keyProperty,
                    adapter: curItem.items.getAdapter(),
                });
                records.add(curItem.items.getRecordById(folder.name));
                records.append(items);
                if (
                    !curItem.selectedKeys?.[folder.name]?.length ||
                    curItem.selectedKeys?.[folder.name] === undefined
                ) {
                    folder.selectedKeys = [curItem.emptyKey || null];
                } else {
                    folder.selectedKeys = curItem.selectedKeys[folder.name];
                }

                folder.sourceController = new SourceController({
                    items: records,
                    keyProperty,
                    parentProperty,
                    source: folder.source,
                    filter: folder.filter,
                    navigation: folder.navigation,
                });
                result = result.concat(
                    this._prepareItemMenuOptions(
                        folder,
                        !isLast && index === folders.length - 1,
                        index !== folders.length - 1
                    )
                );
            });
            return result;
        } else {
            return this._prepareItemMenuOptions({ ...curItem, order: menuItemIndex++ }, !isLast);
        }
    }

    private _getFolders(filterItem) {
        const folders = [];
        factory(filterItem.selectorItems).each((item) => {
            if (item.get(filterItem.nodeProperty)) {
                const folderItem = { ...filterItem };
                folderItem.name = item.getKey();
                folderItem.dataLoadCallback = this._dataLoadCallback.bind(this, folderItem);
                folders.push(folderItem);
            }
        });
        return folders;
    }

    private _hasFolders(): boolean {
        return !!Object.keys(this._folders).length;
    }

    private _prepareItemMenuOptions(
        curItem,
        showFooterSeparator: boolean,
        addSpacer?: boolean
    ): IMenuControlOptions[] {
        const item = { ...curItem };
        let initSelectedKeys;
        if (this._menuConfigs?.[curItem.name]) {
            initSelectedKeys = this._menuConfigs[curItem.name].initSelectedKeys;
        } else if (item.nodeProperty) {
            if (
                item.multiSelect ||
                !item.selectedKeys ||
                !Object.values(item.selectedKeys).length
            ) {
                initSelectedKeys = Object.values(item.selectedKeys)?.flat();
            } else {
                const sKey = item.selectedKeys[curItem.name] || item.selectedKeys;
                initSelectedKeys = sKey instanceof Array ? sKey : [sKey];
            }
        } else {
            initSelectedKeys = [...item.selectedKeys];
        }
        item.initSelectedKeys = initSelectedKeys;
        if (!initSelectedKeys.length && item.emptyText) {
            item.initSelectedKeys = item.emptyKey || !item.multiSelect ? [item.emptyKey] : [];
        }
        item.markedKey =
            (item.nodeProperty
                ? Object.values(item.selectedKeys)?.flat()
                : item.selectedKeys)?.[0] ?? null;

        if (!item.multiSelect || item.markedKey) {
            item.markerVisibility = 'onactivated';
        }
        if (item.sourceController) {
            item.sourceController.setParentProperty(item.parentProperty);
        }
        if (item.searchParam) {
            item.emptyTemplate = item.emptyTemplate || 'Controls/menu:EmptyTemplate';
        }
        item.itemPadding = MENU_ITEM_PADDING;
        item.filter = item.sourceController ? item.sourceController.getFilter() : item.filter;
        const showMoreButton = item.nodeProperty && item.hasMoreButton && item.selectorTemplate;
        if (showMoreButton || showFooterSeparator || addSpacer) {
            item.footerContentTemplate = 'Controls/filterPopup:SimplePanelFooterTemplate';
            item.footerItemData = {
                showMoreButton,
                showFooterSeparator,
                addSpacer,
                moreButtonClick: this._moreButtonHierarchyClick.bind(this),
                name: item.name,
            };
        }

        return [{ ...item, viewMode: undefined }];
    }

    private _dataLoadCallback(filterItem: IFilterItem, items: RecordSet): void {
        items.forEach((item) => {
            if (item.get(filterItem.nodeProperty)) {
                item.set(filterItem.nodeProperty, false); // устанавливаем как скрытый узел
            }
        });
    }

    private _isEqualKeys(oldKeys: string[], newKeys: string[]): boolean {
        let result;
        if (oldKeys[0] === null && !newKeys.length) {
            result = false;
        } else {
            result = isEqual(oldKeys, newKeys);
        }
        return result;
    }

    private _needShowApplyButton(menuConfigs: TMenuConfig): boolean {
        let isNeedShowApplyButton = false;
        Object.keys(menuConfigs).forEach((name) => {
            const item = menuConfigs[name];
            if (!this._isEqualKeys(item.initSelectedKeys, this._selectedKeys[name])) {
                isNeedShowApplyButton = true;
            }
        });
        return isNeedShowApplyButton;
    }

    private _getResult(event: Event, action: string) {
        const resultSelectedKeys: Record<string, Record<string, string[]>> = {};
        Object.keys(this._selectedKeys).forEach((name) => {
            const item = this._menuConfigs[name];
            const items = item.sourceController ? item.sourceController.getItems() : item.items;
            const selectedKeys = this._getSelectedKeysInOrder(
                items,
                this._selectedKeys[name],
                item.keyProperty
            );
            const folderName = this._getFolderFilterName(name);
            if (folderName) {
                if (!resultSelectedKeys[folderName]) {
                    resultSelectedKeys[folderName] = {};
                }
                if (!name.includes(EMPTY_ITEM_NAME)) {
                    resultSelectedKeys[folderName][name] = selectedKeys;
                }
            } else {
                resultSelectedKeys[name] = selectedKeys;
            }
        });
        return {
            action,
            event,
            selectedKeys: resultSelectedKeys,
            searchValue: this._searchValue,
        };
    }

    private _getSelectedKeysInOrder(
        items: RecordSet,
        selectedKeys: TKey[],
        keyProperty: string
    ): string[] {
        const orderedKeys = [];
        items.forEach((item) => {
            const key = item.get(keyProperty);
            const isSelected = selectedKeys.includes(key);
            if (isSelected) {
                orderedKeys.push(key);
            }
        });
        return orderedKeys;
    }

    protected _needShowEmptyItem(name: string, itemKey: string): boolean {
        const item = this._menuConfigs[name];
        const isNode = item.items?.getRecordById(itemKey)?.get(item.nodeProperty);
        if (isNode !== true && isNode !== false) {
            if (item.emptyText) {
                return item.emptyKey !== undefined ? itemKey === item.emptyKey : itemKey === null;
            } else {
                return itemKey === item.emptyKey;
            }
        }
    }

    private _hasSearch(menuConfigs: TMenuConfig, dateMenuItem: IFilterItem[]): boolean {
        const items = Object.values(menuConfigs);
        return !!(
            items.length === 1 &&
            !dateMenuItem &&
            items[0].searchParam &&
            (items[0].sourceController?.hasMoreData('down') ||
                items[0].items?.getCount() >= COUNT_OF_ITEMS_FOR_SEARCH)
        );
    }

    private _getEmptyItemFontWeight(): string {
        const count = Object.keys(this._menuConfigs).length + (this._dateMenuItem ? 1 : 0);
        return count > 1 ? 'bold' : 'normal';
    }

    protected _beforeUnmount(): void {
        if (this._searchValue) {
            this._notify('sendResult', [{ action: 'menuClosed', searchValue: this._searchValue }]);
        }
    }

    static getDefaultOptions(): Partial<ISimplePanelOptions> {
        return {
            itemTemplate: defaultItemTemplate,
        };
    }
}

export default Panel;

/**
 * @name Controls/_filterPopup/SimplePanel#items
 * @cfg {RecordSet} Список, в котором описана конфигурация для каждого фильтра, отображающегося в SimplePanel.
 * Формируется контролом {@link Controls/filter:View}. При использовании Controls/_filterPopup/SimplePanel в качестве шаблона для фильтра опцию items необходимо прокинуть в контрол.
 * @example
 * WML:
 * <pre>
 *    <Controls.filterPopup:SimplePanel items="{{_options.items}}"/>
 * </pre>
 */
