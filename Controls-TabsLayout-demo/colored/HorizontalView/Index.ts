import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout-demo/colored/HorizontalView/HorizontalView';
import 'css!Controls-TabsLayout-demo/colored/BaseView/Default/Style';
import { HeadCounter } from 'Controls-TabsLayout/colored';
export default class ContainerBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _headCounter: object = HeadCounter;

    protected _selectedKey: number = null;
}
