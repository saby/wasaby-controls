/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filterPopup/SimplePanel/_List/List';
import { IFilterItem } from 'Controls/filter';
import collection = require('Types/collection');
import Merge = require('Core/core-merge');
import { TKey } from 'Controls/interface';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import 'css!Controls/filterPopup';
import { IMenuControlOptions } from 'Controls/_menu/interface/IMenuControl';
import { IInfoboxTemplateOptions } from 'Controls/_popupTemplate/InfoBox/Template/InfoBox';

export interface IListPanelOptions extends IMenuControlOptions {
    items: RecordSet;
    selectorItems?: RecordSet;
}

class List extends Control<IListPanelOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: TKey[];
    protected _items: IFilterItem[] = null;
    protected _menuViewMode: string = '';
    protected _searchValue: string;
    protected _itemPadding = {
        right: 'menu-close',
    };

    _beforeMount(options: IListPanelOptions) {
        this._setSelectedKeys(options);
    }

    _beforeUpdate(newOptions: IListPanelOptions) {
        if (newOptions.selectedKeys !== this._options.selectedKeys) {
            this._setSelectedKeys(newOptions);
        }
        if (newOptions.searchValue !== this._options.searchValue) {
            this._searchValueChanged(newOptions.searchValue);
        }
    }

    _selectedItemsChanged(event: Event, selectedItems: Model[]): void {
        if (!this._options.readOnly) {
            const items = this._options.sourceController
                ? this._options.sourceController.getItems()
                : this._options.items;
            const selectedKeys = this._getSelectedKeysInOrder(items, selectedItems);
            this._notify('checkBoxClick', [selectedKeys]);
        }
    }

    _itemClickHandler(event: Event, item: Model) {
        if (!this._options.readOnly) {
            this._notify('itemClick', [[item.get(this._options.keyProperty)]]);
        }
    }

    protected _searchValueChanged(value: string): void {
        const controllerFilter = this._options.sourceController.getFilter() || {};
        let filter;
        if (value) {
            filter = {
                ...controllerFilter,
                [this._options.searchParam]: value,
            };
        } else {
            filter = { ...controllerFilter };
            delete filter[this._options.searchParam];
        }
        this._options.sourceController.load(undefined, undefined, filter).then(() => {
            this._menuViewMode = value ? 'search' : undefined;
            this._searchValue = value;
        });
    }

    private _setSelectedKeys(options: IListPanelOptions): void {
        this._selectedKeys = options.selectedKeys;
        if (!options.selectedKeys.length && options.emptyText) {
            this._selectedKeys = options.emptyKey || !options.multiSelect ? [options.emptyKey] : [];
        }
    }

    private _getSelectedKeysInOrder(items: RecordSet, selectedItems: Model[]): string[] {
        const orderedKeys = [];
        items.forEach((item) => {
            const key = item.get(this._options.keyProperty);
            const isSelected = selectedItems.find(
                (selectedItem) => selectedItem.get(this._options.keyProperty) === key
            );
            if (isSelected) {
                orderedKeys.push(key);
            }
        });
        return orderedKeys;
    }

    _moreButtonClick(): void {
        const selectorTemplate = this._options.selectorTemplate;
        const selectorOpener =
            this._options.selectorTemplate.mode === 'dialog'
                ? this._options.dialogOpener
                : this._options.selectorOpener;
        const selectorDialogResult = this._options.selectorDialogResult;
        const selectedItems = [];

        // TODO: Selector/Controller сейчас не поддерживает работу с ключами:
        //  https://online.sbis.ru/opendoc.html?guid=936f6546-2e34-4753-85af-8e644c320c8b
        this._selectedKeys.forEach((key) => {
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

    private _afterOpenDialogCallback(selectedItems: Model[]): void {
        this._notify('moreButtonClick', [selectedItems]);
    }
}

export = List;
