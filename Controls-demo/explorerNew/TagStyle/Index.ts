import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/TagStyle/TagStyle';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
