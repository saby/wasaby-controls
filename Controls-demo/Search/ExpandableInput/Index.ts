import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Search/ExpandableInput/expandableInput');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
