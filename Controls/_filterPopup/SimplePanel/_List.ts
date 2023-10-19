/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filterPopup/SimplePanel/_List/List';
import { ItemTemplate as defaultItemTemplate } from 'Controls/dropdown';
import * as emptyItemTemplate from 'wml!Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate';
import * as DropdownViewModel from 'Controls/_filterPopup/SimplePanel/DropdownViewModel';
import { IFilterItem } from 'Controls/filter';
import collection = require('Types/collection');
import Merge = require('Core/core-merge');
import { factory } from 'Types/chain';
import { isEqual } from 'Types/object';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'UI/Vdom';
import { ISwipeEvent } from 'Controls/listRender';
import 'css!Controls/filterPopup';

class List extends Control {
    protected _template: TemplateFunction = template;
    protected _items: IFilterItem[] = null;
    protected _defaultItemTemplate: TemplateFunction = defaultItemTemplate;
    protected _emptyItemTemplate: TemplateFunction = emptyItemTemplate;
    protected _selectionChanged: boolean = false;
    protected _listModel: typeof DropdownViewModel;

    _beforeMount(options: object) {
        this._listModel = new DropdownViewModel({
            iconSize: options.iconSize,
            items: options.items || [],
            selectedKeys: options.selectedKeys,
            keyProperty: options.keyProperty,
            itemTemplateProperty: options.itemTemplateProperty,
            displayProperty: options.displayProperty,
            emptyText: options.emptyText,
            emptyKey: options.emptyKey,
            hasApplyButton: options.hasApplyButton,
            hasClose: true,
            nodeProperty: options.nodeProperty,
            parentProperty: options.parentProperty,
            levelPadding: options.levelPadding,
            readOnly: options.readOnly,
            theme: options.theme,
        });
        if (options.multiSelect && options.selectedKeys?.length) {
            this._selectionChanged = this._isSelectedCheckbox(options);
        }
        this._afterOpenDialogCallback = this._afterOpenDialogCallback.bind(this);
    }

    _beforeUpdate(newOptions: object) {
        if (newOptions.items && newOptions.items !== this._options.items) {
            this._listModel.setItems(newOptions);
        }
        if (newOptions.selectedKeys !== this._options.selectedKeys) {
            this._listModel.setSelectedKeys(newOptions.selectedKeys);
        }

        if (newOptions.selectionChanged !== this._options.selectionChanged) {
            this._selectionChanged = newOptions.selectionChanged;
        }
    }

    _itemClickHandler(event: Event, item: Model) {
        if (!this._options.readOnly && !item.get('readOnly')) {
            if (this._isNeedUpdateSelectedKeys(event.target, item)) {
                this._selectionChanged = true;
                this._updateSelection(this._listModel, item, this._options.resetValue);
                const selectedKeys = this._getSelectedKeysInOrder(
                    this._listModel.getItems(),
                    this._listModel.getSelectedKeys().slice()
                );
                this._notify('checkBoxClick', [selectedKeys]);
            } else {
                this._notify('itemClick', [[item.get(this._options.keyProperty)]]);
            }
        }
    }

    private _getSelectedKeysInOrder(items: RecordSet, keys: string[]): string[] {
        const orderedKeys = [];
        items.forEach((item) => {
            const key = item.get(this._options.keyProperty);
            if (keys.includes(key)) {
                orderedKeys.push(key);
            }
        });
        return orderedKeys;
    }

    _onItemSwipe(event: SyntheticEvent<ISwipeEvent>, itemData: object) {
        if (event.nativeEvent.direction === 'left') {
            this._listModel.setSwipeItem(itemData);
        }
    }

    _openSelectorDialog() {
        const selectorTemplate = this._options.selectorTemplate;
        const selectorOpener =
            this._options.selectorTemplate.mode === 'dialog'
                ? this._options.dialogOpener
                : this._options.selectorOpener;
        const selectorDialogResult = this._options.selectorDialogResult;
        const selectedItems = [];

        // TODO: Selector/Controller сейчас не поддерживает работу с ключами:
        //  https://online.sbis.ru/opendoc.html?guid=936f6546-2e34-4753-85af-8e644c320c8b
        factory(this._listModel.getSelectedKeys()).each((key) => {
            if (
                key !== undefined &&
                key !== null &&
                this._options.selectorItems.getRecordById(key)
            ) {
                selectedItems.push(this._options.selectorItems.getRecordById(key));
            }
        });

        const templateConfig = {
            selectedItems: new collection.List({ items: selectedItems }),
            multiSelect: this._options.multiSelect,
            handlers: {
                onSelectComplete: (event, result) => {
                    selectorDialogResult(result);
                    selectorOpener.close();
                },
            },
        };
        Merge(templateConfig, selectorTemplate.templateOptions);
        selectorOpener.open(
            Merge(
                {
                    opener: this._options.opener,
                    eventHandlers: {
                        onResult: selectorDialogResult,
                    },
                    templateOptions: templateConfig,
                    template: selectorTemplate.templateName,
                    isCompoundTemplate: this._options.isCompoundTemplate,
                },
                selectorTemplate.popupOptions || {}
            )
        );

        if (this._afterOpenDialogCallback) {
            this._afterOpenDialogCallback(templateConfig.selectedItems);
        }
    }

    private _isSelectedCheckbox(options: object): boolean {
        return options.selectedKeys.some((key) => {
            const item = options.items.getRecordById(key);
            if (item) {
                return !this._isSpecialItem(item, options);
            }
        });
    }

    private _isSpecialItem(item: Model, options: object): boolean {
        const emptyKey = options.emptyText ? options.emptyKey || null : options.emptyKey;
        const isEmptyItem = item.get(options.keyProperty) === emptyKey;
        const isFixedItem = this._isFixedItem(item);
        const isFolder = item.get(options.nodeProperty);
        return isEmptyItem || isFixedItem || isFolder;
    }

    private _isFixedItem(item: Model): boolean {
        return !item.has('HistoryId') && item.get('pinned');
    }

    private _isNeedUpdateSelectedKeys(target: HTMLElement, item: Model) {
        const clickOnCheckBox = target.closest('.controls-Menu__row-checkbox');
        return (
            this._options.multiSelect &&
            (clickOnCheckBox || this._selectionChanged) &&
            !this._isSpecialItem(item, this._options)
        );
    }

    private _updateSelection(
        listModel: typeof DropdownViewModel,
        item: Model,
        resetValue: unknown
    ): void {
        let updatedSelectedKeys = [...listModel.getSelectedKeys()];
        const key = item.getKey();
        if (updatedSelectedKeys.includes(key)) {
            const index = updatedSelectedKeys.indexOf(key);
            updatedSelectedKeys.splice(index, 1);

            if (!updatedSelectedKeys.length) {
                updatedSelectedKeys = [];
            }
        } else {
            const oldItem = this._options.items.getRecordById(updatedSelectedKeys[0]);
            let isFixedItemSelected = false;
            if (updatedSelectedKeys.length) {
                isFixedItemSelected = oldItem && this._isFixedItem(oldItem);
            }
            const isEmptyItem =
                oldItem && oldItem.get(this._options.keyProperty) === this._options.emptyKey;
            if ((isEmptyItem && this._options.emptyText) || isFixedItemSelected) {
                updatedSelectedKeys = [];
            }
            updatedSelectedKeys.push(key);
        }
        listModel.setSelectedKeys(updatedSelectedKeys);
    }

    private _afterOpenDialogCallback(selectedItems: Model[]): void {
        this._notify('moreButtonClick', [selectedItems]);
    }
}

export = List;
