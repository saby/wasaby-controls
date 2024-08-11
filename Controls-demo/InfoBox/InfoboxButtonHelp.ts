import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/InfoBox/InfoboxButtonHelp');

class InfoboxButtonHelp extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['Controls-demo/InfoBox/resources/InfoboxButtonHelp'];
}
export default InfoboxButtonHelp;
