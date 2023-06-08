import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import { _companies } from 'Controls-demo/Lookup/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Lookup/MultipleInput/Template');
import selectorTemplateWithTabs = require('Controls-demo/Lookup/FlatListSelectorWithTabs/FlatListSelectorWithTabs');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeyCustomPlaceholder: string[] = [];
    protected _source: Memory;
    protected _navigation: object;
    protected _beforeMount(): void {
        this._source = new Memory({
            data: _companies,
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

        this._selectorTemplateWithTabs = {
            templateName: selectorTemplateWithTabs,
            popupOptions: {
                width: 500,
            },
        };
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
}
