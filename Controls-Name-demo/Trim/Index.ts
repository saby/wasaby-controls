import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Name-demo/Trim/Template';
import 'css!Controls-Name-demo/Demo';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _lastName: string = '';
    protected _middleName: string = '';
    protected _firstName: string = '';
    protected _lastName2: string = '';
    protected _middleName2: string = '';
    protected _firstName2: string = '';
    protected _nameFields: string[] = ['lastName', 'firstName', 'middleName'];
}
