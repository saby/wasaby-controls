import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Record } from 'Types/entity';
import { _companies } from 'Controls-demo/Lookup/DemoHelpers/DataCatalog';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import controlTemplate = require('wml!Controls-demo/Lookup/CounterAlignment/Index');
import selectorTemplate = require('Controls-demo/Lookup/FlatListSelector/FlatListSelector');
import selectorTemplateWithTabs = require('Controls-demo/Lookup/FlatListSelectorWithTabs/FlatListSelectorWithTabs');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory = null;
    protected _selectedKeys: any = null;
    protected _selectorTemplate: object = null;

    protected _beforeMount() {
        this._source = new Memory({
            data: _companies,
            filter(item: Record, queryFilter: object) {
                const selectionFilterFn = (optItem, filter) => {
                    let isSelected = false;
                    const itemId = optItem.get('id');

                    filter.selection.get('marked').forEach((selectedId) => {
                        if (
                            selectedId === itemId ||
                            (selectedId === null &&
                                filter.selection.get('excluded').indexOf(itemId) === -1)
                        ) {
                            isSelected = true;
                        }
                    });

                    return isSelected;
                };
                const normalFilterFn = MemorySourceFilter();
                return queryFilter.selection
                    ? selectionFilterFn(item, queryFilter)
                    : normalFilterFn(item, queryFilter);
            },
            idProperty: 'id',
        });
        this._sourceButton = new Memory({
            data: _companies,
            idProperty: 'id',
        });

        this._selectedKeys = [
            'Сбербанк-Финанс, ООО',
            'Петросоюз-Континент, ООО',
            'Альфа Директ сервис, ОАО',
            'Иванова Зинаида Михайловна, ИП',
            'Ромашка, ООО',
            'АК "ТРАНСНЕФТЬ", ОАО',
            'Инори, ООО',
            '"Компания "Тензор" ООО',
        ];

        this._selectorTemplate = {
            templateName: selectorTemplate,
            templateOptions: {
                headingCaption:
                    'Выберите организацию (+длинный текст для проверки, что caption обрезается)',
            },
            popupOptions: {
                width: 600,
            },
        };
        this._selectorTemplateWithTabs = {
            templateName: selectorTemplateWithTabs,
            popupOptions: {
                width: 770,
            },
            templateOptions: {
                multiSelect: true,
                source: this._source,
            },
        };
    }

    protected selectedKeysChanged(e: Event, keys: string[]): void {
        this._textMultiply = 'Выбраны ключи: ' + keys.join(', ');
    }

    static _styles: string[] = ['Controls-demo/Lookup/Index'];
}
