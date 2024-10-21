import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name-demo/doc/Suggest/Suggest';
import { getSuggestSource } from 'Controls-Name-demo/doc/Suggest/Data';
import 'css!Controls-Name-demo/doc/Suggest/Index';
import { Memory } from 'Types/source';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _lastName: string = '';
    protected _middleName: string = '';
    protected _firstName: string = '';
    protected _fields: string[] = [];
    protected _suggestSource: Memory = null;

    protected _beforeMount(): void {
        this._fields = ['lastName', 'firstName', 'middleName'];

        this._suggestSource = getSuggestSource();
    }
}

export default Demo;
