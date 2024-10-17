import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate';
import { Memory } from 'Types/source';
import { Controller } from 'Controls/lookupPopup';
import { Model } from 'Types/entity';

interface IFilter {
    selection: Model;
}

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
            filter: (item, queryFilter: IFilter) => {
                if (queryFilter.selection) {
                    const itemId = String(item.get('id'));
                    const marked = queryFilter.selection.get('marked');
                    let isSelected = false;
                    marked.forEach((selectedId) => {
                        if (String(selectedId) === itemId) {
                            isSelected = true;
                        }
                    });
                    return isSelected;
                }
                return true;
            },
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
