import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Dialog/backgroundStyle/backgroundStyle');

class BackgroundStyle extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default BackgroundStyle;
