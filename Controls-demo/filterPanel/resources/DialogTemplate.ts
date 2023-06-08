import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/filterPanel/resources/DialogTemplate';
import { Memory } from 'Types/source';

interface IOptions extends IControlOptions {
    items: object[];
}

export default class extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _source: Memory;
    protected _selectionChanged: boolean = false;
    private _filter: object = {};

    protected _beforeMount(options: IOptions): void {
        this._source = new Memory({
            idProperty: 'id',
            data: options.items,
            filter: (item, queryFilter) => {
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
        this._filter = {};
    }

    _selectedKeysChanged() {
        this._selectionChanged = true;
    }

    _selectComplete() {
        this._children.SelectorController._selectComplete();
    }
}
