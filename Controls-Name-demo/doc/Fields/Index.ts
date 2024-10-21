import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name-demo/doc/Fields/Fields';
import 'css!Controls-Name-demo/doc/Fields/Index';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _firstName: string = '';
    protected _lastName: string = '';
    protected _middleName: string = '';
    protected _firstName2: string = '';
    protected _lastName2: string = '';
    protected _middleName2: string = '';
    protected _firstName3: string = '';
    protected _lastName3: string = '';
    protected _middleName3: string = '';
    protected _fields: string[] = [];
    protected _fields2: string[] = [];
    protected _fields3: string[] = [];

    protected _beforeMount(): void {
        this._fields = ['lastName', 'firstName'];
        this._fields2 = ['firstName', 'middleName'];
        this._fields3 = ['firstName'];
    }
}

export default Demo;
