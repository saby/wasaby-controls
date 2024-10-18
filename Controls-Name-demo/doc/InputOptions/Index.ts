import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name-demo/doc/InputOptions/InputOptions';
import 'css!Controls-Name-demo/doc/InputOptions/Index';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _lastName: string = 'Иванов';
    protected _middleName: string = 'Иванович';
    protected _firstName: string = 'Иван';
    protected _fields: string[] = [];

    protected _beforeMount(): void {
        this._fields = ['lastName', 'firstName', 'middleName'];
    }
}

export default Demo;
