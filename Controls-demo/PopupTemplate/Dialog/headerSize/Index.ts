import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/PopupTemplate/Dialog/headerSize/headerSize';

class FooterTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default FooterTemplate;
