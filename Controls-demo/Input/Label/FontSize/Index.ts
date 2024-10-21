import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Label/FontSize/Index');

class FontSize extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _fontSizes: string[][] = [
        ['inherit', 'xs'],
        ['s', 'm'],
        ['l', 'xl'],
        ['2xl', '3xl'],
        ['4xl', '5xl'],
        ['6xl', '7xl'],
    ];
}

export default FontSize;
