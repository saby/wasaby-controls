import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/Index');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
