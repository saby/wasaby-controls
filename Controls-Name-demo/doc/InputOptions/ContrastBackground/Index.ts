import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name-demo/doc/InputOptions/ContrastBackground/Index';
import 'css!Controls-Name-demo/doc/InputOptions/ContrastBackground/Index';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _lastName1: string = '';
    protected _middleName1: string = '';
    protected _firstName1: string = '';
    protected _lastName2: string = '';
    protected _middleName2: string = '';
    protected _firstName2: string = '';
    protected _fields: string[] = [];

    protected _beforeMount(): void {
        this._fields = ['lastName', 'firstName', 'middleName'];
    }
}

export default Demo;
