import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/SingleRecordResults/SingleRecordResults';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
