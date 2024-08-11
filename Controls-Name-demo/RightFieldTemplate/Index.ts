import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name-demo/RightFieldTemplate/Template';
import 'css!Controls-Name-demo/Demo/Demo';

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _lastName: string = '';
    protected _middleName: string = '';
    protected _firstName: string = '';
    protected _nameFields: string[] = ['lastName', 'firstName', 'middleName'];
}

export default Index;
