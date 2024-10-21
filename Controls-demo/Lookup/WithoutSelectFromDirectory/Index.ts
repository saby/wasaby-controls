import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import * as template from 'wml!Controls-demo/Lookup/WithoutSelectFromDirectory/Index';
import {
    lookupsOptions,
    lookupsOptionsMultiSelect,
} from 'Controls-demo/Lookup/WithoutSelectFromDirectory/Data';
import { IMultipleLookupInputOptions } from 'Controls/lookup';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: object = {};
    protected _selectedKeysMultiSelect: object = {};
    protected _value: object = {};
    protected _lookupOptions: IMultipleLookupInputOptions[];
    protected _lookupOptionsMultiSelect: IMultipleLookupInputOptions[];

    protected _beforeMount(): void {
        this._lookupOptions = lookupsOptions;
        this._lookupOptionsMultiSelect = lookupsOptionsMultiSelect;
        this._selectedKeys = {
            company: [0],
        };
        this._selectedKeysMultiSelect = {};
    }

    protected _selectedKeysChanged(event: SyntheticEvent, value: object): void {
        this._selectedKeys = value;
    }

    protected _selectedKeysChangedMultiSelect(event: SyntheticEvent, value: object): void {
        this._selectedKeysMultiSelect = value;
    }

    protected _valueChanged(event: SyntheticEvent, value: object): void {
        this._value = value;
    }
}
