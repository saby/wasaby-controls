import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/HeaderRightTemplate/Template');
import { EventUtils } from 'UI/Events';

class Template extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _notifyHandler: Function = EventUtils.tmplNotify;
}
export default Template;
