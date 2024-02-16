import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Dialog/Resizable/Popup');

class Popup extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Popup;
