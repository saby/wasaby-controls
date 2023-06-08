import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import * as template from 'wml!Controls-demo/Lookup/MultipleInputNew/MultipleInputNew';
import { lookupOptions } from 'Controls-demo/Lookup/MultipleInputNew/resources/Data';
import { IMultipleLookupInputOptions } from 'Controls/lookup';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: object = {};
    protected _selectedKeysReadOnlyLookup: object = {};
    protected _value: object = {};
    protected _lookupOptions: IMultipleLookupInputOptions[];

    protected _beforeMount(): void {
        this._lookupOptions = lookupOptions;
        this._selectedKeys = {
            company: [0],
            contractor: [1],
            employee: [0],
        };
        this._selectedKeysReadOnlyLookup = {
            company: [0],
            contractor: [1],
            employee: [],
        };
    }

    protected _selectedKeysChanged(event: SyntheticEvent, value: object): void {
        this._selectedKeys = value;
    }

    protected _valueChanged(event: SyntheticEvent, value: object): void {
        this._value = value;
    }
}
