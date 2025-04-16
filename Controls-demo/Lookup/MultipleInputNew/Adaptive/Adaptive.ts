import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import * as template from 'wml!Controls-demo/Lookup/MultipleInputNew/Adaptive/Adaptive';
import {
    lookupOptions,
    initialContractorConfig,
    changedContractorConfig,
} from 'Controls-demo/Lookup/MultipleInputNew/resources/Data';
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
            contractor: [0],
            employee: [0],
        };
    }

    protected _selectedKeysChanged(event: SyntheticEvent, value: object): void {
        this._selectedKeys = value;
        this._lookupOptions[1] = this._selectedKeys.company.length
            ? changedContractorConfig
            : initialContractorConfig;
    }

    protected _valueChanged(event: SyntheticEvent, value: object): void {
        this._value = value;
    }
}
