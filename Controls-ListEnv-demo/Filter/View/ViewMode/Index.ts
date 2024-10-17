import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-ListEnv-demo/Filter/View/ViewMode/Index');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
