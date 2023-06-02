import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import {
    _companies,
    _equipment,
    _departmentsDataLong,
} from 'Controls-demo/Lookup/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Lookup/Index');
import suggestTemplate = require('wml!Controls-demo/Lookup/resources/SuggestTemplate');
import selectorTemplate = require('Controls-demo/Lookup/FlatListSelector/FlatListSelector');
import selectorTemplateWithTabs = require('Controls-demo/Lookup/FlatListSelectorWithTabs/FlatListSelectorWithTabs');
import { default as BaseLookupInput } from 'Controls/lookup';
import { factory as collectionFactory } from 'Types/collection';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _suggestTemplate: TemplateFunction = suggestTemplate;
    protected _selectorTemplate: TemplateFunction = null;
    protected _selectedKeyWithComment: string[] = [
        'Иванова Зинаида Михайловна, ИП',
    ];
    protected _selectedKeyCustomPlaceholder: string[] = [];
    protected _selectedKeysMultiLineReadOnly: string[] = [
        'Иванова Зинаида Михайловна, ИП',
        'Все юридические лица',
        'Наша компания',
        'Сбербанк-Финанс, ООО',
        'Петросоюз-Континент, ООО',
        'Альфа Директ сервис, ОАО',
        'АК "ТРАНСНЕФТЬ", ОАО',
        'Ромашка, ООО',
    ];
    protected _selectedKeysReadOnly: string[] = [
        'Иванова Зинаида Михайловна, ИП',
    ];
    protected _selectedKeysMultiSelectReadOnly: string[] = [
        'Иванова Зинаида Михайловна, ИП',
        'Все юридические лица',
        'Наша компания',
    ];
    protected _selectedKeysMultiSelectLazy: string[] = [
        'Иванова Зинаида Михайловна, ИП',
        'Все юридические лица',
        'Наша компания',
        'Сбербанк-Финанс, ООО',
        'Петросоюз-Континент, ООО',
        'Альфа Директ сервис, ОАО',
        'АК "ТРАНСНЕФТЬ", ОАО',
        'Ромашка, ООО',
    ];
    protected _selectedKeysMultiSelectHiddenCounter: string[] = [
        'Иванова Зинаида Михайловна, ИП',
        'Все юридические лица',
        'Наша компания',
        'Сбербанк-Финанс, ООО',
        'Петросоюз-Континент, ООО',
        'Альфа Директ сервис, ОАО',
        'АК "ТРАНСНЕФТЬ", ОАО',
        'Ромашка, ООО',
    ];
    protected _selectedKeyLink: string[] = [];
    protected _selectedKeysDirectories: string[] = [];
    protected _source: Memory;
    protected _navigation: object;
    private _infoMultiSelectLazy: object = {
        selectedKeysCount: undefined,
        loadedKeysCount: undefined,
    };
    protected _children: Record<string, BaseLookupInput>;
    protected _beforeMount(): void {
        this._source = new Memory({
            data: _companies,
            idProperty: 'id',
            filter: MemorySourceFilter(),
        });

        this._departmentsSource = new Memory({
            data: _departmentsDataLong,
            idProperty: 'id',
            filter: MemorySourceFilter(),
        });

        this._eqiupmentSource = new Memory({
            data: _equipment,
            idProperty: 'id',
            filter: MemorySourceFilter(),
        });
        this._navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: {
                pageSize: 2,
                page: 0,
                hasMore: false,
            },
        };

        this._selectorTemplate = {
            templateName: selectorTemplate,
            templateOptions: {
                headingCaption:
                    'Выберите организацию (+длинный текст для проверки, что caption обрезается)',
            },
            popupOptions: {
                width: 500,
            },
        };

        this._selectorTemplateWithTabs = {
            templateName: selectorTemplateWithTabs,
            popupOptions: {
                width: 500,
            },
        };

        this._itemsStyle = new Memory({
            idProperty: 'id',
            data: [
                { id: 'bold', title: 'bold' },
                { id: 'accent', title: 'accent' },
                { id: 'primary', title: 'primary' },
            ],
        });
        this._itemsSize = new Memory({
            idProperty: 'id',
            data: [
                { id: 'm', title: 'm' },
                { id: 'l', title: 'l' },
                { id: 'xl', title: 'xl' },
                { id: '2xl', title: '2xl' },
                { id: '3xl', title: '3xl' },
            ],
        });

        this._selectorTemplateEqiupment = {
            templateName: selectorTemplate,
            templateOptions: {
                headingCaption: 'Выберите оборудование',
                source: this._eqiupmentSource,
            },
            popupOptions: {
                width: 300,
            },
        };
    }

    protected _afterMount(): void {
        this._updateInfoMultiSelectLazy();
    }

    protected _afterUpdate(): void {
        this._updateInfoMultiSelectLazy();
    }

    protected showSelectorInsideLabel(): void {
        this._children.lookupInsideLabel.showSelector();
    }

    protected showSelectorLabelAbove(): void {
        this._children.lookupLabelAbove.showSelector();
    }

    protected showSelectorLabelBeside(): void {
        this._children.lookupLabelBeside.showSelector();
    }

    protected _placeholderKeyCallback(selectedItems: RecordSet): void {
        return ['manufacturer', 'category', 'model'][selectedItems.getCount()];
    }

    protected showSelector(event: Event, selectedTab: string): void {
        this._children.directoriesLookup.showSelector({
            templateOptions: {
                selectedTab,
            },
        });
    }

    protected showSelectorCustomPlaceholder(event: Event, type: string): void {
        const items = this._itemsCustomPlaceholder;
        const countItems = items && items.getCount();
        const parent = countItems ? items.at(countItems - 1).get('id') : null;
        const templateOptions = {
            parent,
            type,
            multiSelect: false,
        };

        this._children.lookupCustomPlaceholder.showSelector({
            templateOptions,
        });
    }

    protected showSelectorCustomPlaceholder2(event: Event, type: string): void {
        const templatesOptions = {
            company: {
                headingCaption:
                    'Выберите организацию (+длинный текст для проверки, что caption обрезается)',
                source: this._source,
            },
            department: {
                headingCaption: 'Выберите подразделение',
                source: this._departmentsSource,
            },
        };

        this._children.lookupCustomPlaceholder2.showSelector({
            template: selectorTemplate,
            templateOptions: templatesOptions[type],
        });
    }

    protected _itemsChanged(event: Event, items: RecordSet): void {
        let parentId;
        const correctKeys = [];
        if (items.at(0) && items.at(0).get('parent')) {
            items.clear();
        } else {
            items.each((item) => {
                correctKeys.push(item.get('id'));
                parentId = item.get('parent');
                if (parentId && correctKeys.indexOf(parentId) === -1) {
                    correctKeys.push(parentId);
                }
            });
        }
        this._selectedKeyCustomPlaceholder = correctKeys;
    }

    protected _placeholderKeyCallback2(items: RecordSet): void {
        let placeholderKey = 'all';

        if (items && items.getCount()) {
            if (items.at(0).has('department')) {
                placeholderKey = 'company';
            } else {
                placeholderKey = 'department';
            }
        }

        return placeholderKey;
    }

    protected selectorCallback(
        event: Event,
        currentItems: RecordSet,
        newItems: RecordSet
    ): RecordSet {
        let indexForReplace = -1;
        const newItem = newItems.at(newItems.getCount() - 1);
        const propName =
            newItem.getIdProperty() === 'id' ? 'city' : 'department';

        // Определяем, добавить элемент или заменить
        currentItems.each((item, index) => {
            if (item.has(propName)) {
                indexForReplace = index;
            }
        });

        if (indexForReplace === -1) {
            currentItems.add(newItem);
        } else {
            currentItems.replace(newItem, indexForReplace);
        }

        return currentItems;
    }

    protected _updateInfoMultiSelectLazy(): void {
        const lookupMultiSelectLazy = this._children.lookupMultiSelectLazy;
        const options = {
            lazyItemsLoading: true,
            selectedKeys: this._selectedKeysMultiSelectLazy,
        };
        const selectedKeysCount =
            lookupMultiSelectLazy._getSelectedItemsCount(options);
        const loadedKeysCount = lookupMultiSelectLazy._getLoadedItemsCount();

        if (
            this._infoMultiSelectLazy.loadedKeysCount !== loadedKeysCount ||
            this._infoMultiSelectLazy.selectedKeysCount !== selectedKeysCount
        ) {
            this._infoMultiSelectLazy = {
                selectedKeysCount,
                loadedKeysCount,
            };
        }
    }

    protected _openInfoBox(event: Event, lookupInfoboxOptions: object): void {
        const contentTemplateOptions = lookupInfoboxOptions.templateOptions;

        if (contentTemplateOptions && contentTemplateOptions.items) {
            contentTemplateOptions.items = factory(contentTemplateOptions.items)
                .sort((firstItem: Model, secondItem: Model) => {
                    return firstItem
                        .get('title')
                        .localeCompare(secondItem.get('title'));
                })
                .value(collectionFactory.list);
        }
    }

    protected _addButtonClickCallback(): void {
        alert('AddButton click!');
    }
}
