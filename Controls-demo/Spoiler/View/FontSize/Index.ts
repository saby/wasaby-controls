import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/View/FontSize/FontSize');

class FontSize extends Control<IControlOptions> {
    protected _expandedM: boolean = true;
    protected _expandedL: boolean = true;
    protected _captions: string = 'Заголовок';

    protected _template: TemplateFunction = controlTemplate;
}
export default FontSize;
