import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Infobox/BackgroundStyle/Template');
import 'css!DemoStand/Controls-demo';

class Infobox extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _stickyPosition: object = {
        direction: {
            horizontal: 'left',
            vertical: 'top',
        },
        targetPoint: {
            horizontal: 'left',
            vertical: 'top',
        },
    };
}

export default Infobox;
