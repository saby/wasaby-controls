import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/BlockLayouts/BlockLayouts');

class BlockLayouts extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['Controls-demo/BlockLayouts/BlockLayouts'];
}

export default BlockLayouts;
