import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/resources/Editors/Additional/Select';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: unknown[] = [];

    protected _beforeMount(options: unknown): void {
        return options.item.editorOptions.source.query().then((result) => {
            this._items = result.getAll();
        });
    }

    protected _beforeUpdate(options: unknown): void {
        if (options.item !== this._options.item) {
            options.item.editorOptions.source.query().then((result) => {
                this._items = result.getAll();
            });
        }
    }
}
