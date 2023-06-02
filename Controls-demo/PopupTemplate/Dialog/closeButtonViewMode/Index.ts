import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Dialog/closeButtonViewMode/closeButtonViewMode');

class BackgroundStyle extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _closeButtonViewModes: string[] = [
        'linkButton',
        'toolButton',
        'external',
    ];
}

export default BackgroundStyle;
