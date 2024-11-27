import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/PropertyGridNew/Editors/Lookup/resources/SelectorTemplate');
import { Memory } from 'Types/source';
import { names as data } from './LookupData';

export default class SelectorTemplate extends Control {
    protected _template: TemplateFunction = template;
    protected _typeDescription: Memory = null;
    protected _keyProperty: string = 'id';
    protected _selectionChanged: boolean = false;

    protected _beforeMount(): void {
        this._typeDescription = new Memory({
            keyProperty: 'id',
            data,
        });
    }
}
