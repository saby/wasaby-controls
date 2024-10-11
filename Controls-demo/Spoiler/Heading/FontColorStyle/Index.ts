import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Heading/FontColorStyle/FontColorStyle');

class FontColorStyle extends Control<IControlOptions> {
    protected _captions: string = 'Заголовок';
    protected _expanded1: boolean = false;
    protected _expanded2: boolean = false;
    protected _template: TemplateFunction = controlTemplate;
}
export default FontColorStyle;
