import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/HeaderTemplate/Template');
import { EventUtils } from 'UI/Events';

class Template extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _notifyHandler: Function = EventUtils.tmplNotify;
    static _styles: string[] = ['Controls-demo/Spoiler/Header/headerTemplate'];
}
export default Template;
