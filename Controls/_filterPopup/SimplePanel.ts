/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_filterPopup/SimplePanel/SimplePanel';
import CoreClone = require('Core/core-clone');
import * as defaultItemTemplate from 'wml!Controls/_filterPopup/SimplePanel/itemTemplate';

import { factory } from 'Types/chain';
import { RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import { IFilterItem, HistoryUtils } from 'Controls/filter';
import 'css!Controls/filterPopup';
import 'css!Controls/menu';

interface ISimplePanelOptions extends IControlOptions {
    itemTemplate: TemplateFunction;
    items: RecordSet;
}

const DEFAULT_MIN_VISIBLE_ITEMS = 2;

/**
 * Панель "быстрых фильтров" для {@link Controls/filter:View}.
 * Шаблон окна, в котором для каждого фильтра с viewMode = 'frequent' отображает список элементов в отдельном блоке.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_filterPopup.less переменные тем оформления}
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
    protected _items: IFilterItem[] = null;
    protected _applyButtonVisible: boolean;
    protected _hasApplyButton: boolean;
    protected _hasSearchInput: boolean;
    protected _searchValue: string;

    protected _beforeMount(options: ISimplePanelOptions): Promise<void> {
        return this._getItems(options.items).then((items) => {
            this._items = items;
            this._hasApplyButton = this._hasMultiSelect(this._items);
            this._hasSearchInput = this._hasSearch(this._items);
        });
    }

    protected _beforeUpdate(newOptions: ISimplePanelOptions): Promise<void> {
        const itemsChanged = newOptions.items !== this._options.items;
        if (itemsChanged) {
            return this._getItems(newOptions.items).then((items) => {
                this._items = items;
                this._applyButtonVisible = this._needShowApplyButton(this._items);
            });
        }
    }

    protected _itemClickHandler(
        event: Event,
        item: IFilterItem,
        keys: string[],
        textValue: string
    ): void {
        if (!isEqual(item.selectedKeys, keys)) {
            const result = {
                action: 'itemClick',
                event,
                selectedKeys: keys,
                textValue,
                id: item.id,
                searchValue: this._searchValue,
            };
            this._notify('sendResult', [result]);
        } else {
            this._notify('sendResult', [{ action: 'menuClosed' }]);
        }
    }

    protected _checkBoxClickHandler(event: Event, index: number, keys: string[]): void {
        this._items[index].selectedKeys = keys;
        this._applyButtonVisible = this._needShowApplyButton(this._items);
        this._notify('selectedKeysChangedIntent', [index, keys]);
    }

    protected _search(event, value: string): void {
        this._searchValue = value;
    }

    protected _searchReset(event, value: string): void {
        this._searchValue = value;
    }

    protected _closeClick(): void {
        this._notify('close');
    }

    protected _applySelection(event: Event): void {
        const result = this._getResult(event, 'applyClick');
        this._notify('sendResult', [result]);
    }

    protected _moreButtonClick(
        event: Event,
        item: IFilterItem,
        selectedItems: IFilterItem[]
    ): void {
        this._notify('sendResult', [
            {
                action: 'moreButtonClick',
                id: item.id,
                selectedItems,
                searchValue: this._searchValue,
            },
        ]);
    }

    private _getItems(initItems: RecordSet) {
        const items = [];
        const loadPromises = [];
        factory(initItems).each((item, index) => {
            const curItem = item.getRawData();
            curItem.initSelectedKeys = this._items
                ? this._items[index].initSelectedKeys
                : CoreClone(item.get('selectedKeys'));
            if (curItem.loadDeferred) {
                loadPromises.push(
                    curItem.loadDeferred.addCallback(() => {
                        if (HistoryUtils.isHistorySource(curItem.source)) {
                            curItem.items = curItem.source.prepareItems(curItem.items);
                            curItem.hasMoreButton = curItem.sourceController.hasMoreData('down');
                        }
                    })
                );
            }
            items.push(curItem);
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
            return displayItems.length ? displayItems : [items[0]];
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

    private _needShowApplyButton(items: IFilterItem[]): boolean {
        let isNeedShowApplyButton = false;
        factory(items).each((item) => {
            if (!this._isEqualKeys(item.initSelectedKeys, item.selectedKeys)) {
                isNeedShowApplyButton = true;
            }
        });
        return isNeedShowApplyButton;
    }

    private _getResult(event: Event, action: string) {
        const result = {
            action,
            event,
            selectedKeys: {},
            searchValue: this._searchValue,
        };
        factory(this._items).each((item) => {
            result.selectedKeys[item.id] = item.selectedKeys;
        });
        return result;
    }

    private _hasMultiSelect(items: IFilterItem[]): boolean {
        let result = false;
        factory(items).each((item) => {
            if (item.multiSelect) {
                result = true;
            }
        });
        return result;
    }

    private _hasSearch(items: IFilterItem[]): boolean {
        return !!(items.length === 1 && items[0].searchParam);
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
