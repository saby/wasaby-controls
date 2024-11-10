import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Infobox/Main');

class Infobox extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static getDefaultOptions(): object {
        return {
            stickyPosition: {
                direction: {
                    horizontal: 'left',
                    vertical: 'top',
                },
                targetPoint: {
                    horizontal: 'left',
                    vertical: 'top',
                },
            },
        };
    }
}

export default Infobox;
