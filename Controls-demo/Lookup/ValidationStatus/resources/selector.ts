import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as template from 'wml!Controls-demo/Lookup/ValidationStatus/resources/selector';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _source: Memory = null;

    protected _beforeMount(options): void {
        this._source = new Memory({
            data: [
                {
                    id: 0,
                    title: 'Значение 1',
                },
                {
                    id: 1,
                    title: 'Значение 2',
                },
            ],
            keyProperty: 'id',
        });
    }
}
