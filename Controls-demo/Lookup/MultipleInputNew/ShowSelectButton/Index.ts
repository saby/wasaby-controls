import { Control, TemplateFunction } from 'UI/Base';
import { lookupOptions } from 'Controls-demo/Lookup/MultipleInputNew/resources/Data';
import { IMultipleLookupInputOptions } from 'Controls/lookup';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: object = {};
    protected _lookupOptions: IMultipleLookupInputOptions[];

    protected _beforeMount(): void {
        this._lookupOptions = lookupOptions;
        this._selectedKeys = {
            company: [0],
            contractor: [1],
            employee: [0],
        };
    }
}
