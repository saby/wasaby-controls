import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Dialog/PropStorageId/Popup');

export default class Popup extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
