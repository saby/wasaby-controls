import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/GroupProperty/Index');

class GroupPropertyDemo extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
export default GroupPropertyDemo;
