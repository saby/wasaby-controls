import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Cut/MaxHeight/MaxHeight');

class Cut extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['DemoStand/Controls-demo'];
}

export default Cut;
