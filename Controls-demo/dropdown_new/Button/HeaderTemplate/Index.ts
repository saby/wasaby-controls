import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/HeaderTemplate/Index');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
