import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name-demo/doc/Base/Base';
import 'css!Controls-Name-demo/doc/Base/Index';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _lastName: string = '';
    protected _middleName: string = '';
    protected _firstName: string = '';
    protected _fields: string[] = [];

    protected _beforeMount(): void {
        this._fields = ['lastName', 'firstName', 'middleName'];
    }
}

export default Demo;
