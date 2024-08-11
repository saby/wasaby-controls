import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/DialogTemplate';
import { Memory } from 'Types/source';
import { Controller } from 'Controls/lookupPopup';
import * as memorySourceFilter from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';
import 'css!Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/DialogTemplate';

interface IOptions {
    items: object[];
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _source: Memory;
    protected _selectionChanged: boolean = false;
    protected _children: {
        SelectorController: Controller;
    };

    protected _beforeMount(options: IOptions): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: options.items,
            filter: memorySourceFilter(),
        });
        this._selectionChanged = false;
    }

    _selectedKeysChanged(): void {
        this._selectionChanged = true;
    }

    _selectComplete(): void {
        this._children.SelectorController.selectComplete();
    }
}
