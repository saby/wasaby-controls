import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/SlidingPanel/backgroundStyle/backgroundStyle');

class BackgroundStyle extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _slidingPanelOptions: object = {
        position: 'bottom',
        desktopMode: 'dialog',
        isMobileMode: true,
    };
}

export default BackgroundStyle;
