import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/SlidingPanel/PopupTemplate/Content/LargeContent');

class PopupTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _isLargeContent: boolean = false;
}
export default PopupTemplate;
