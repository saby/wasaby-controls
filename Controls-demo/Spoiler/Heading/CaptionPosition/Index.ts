import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Heading/CaptionPosition/CaptionPosition');

class CaptionPosition extends Control<IControlOptions> {
    protected _expandedLeft: boolean = true;
    protected _expandedRight: boolean = true;
    protected _captions: string = 'Заголовок';

    protected _template: TemplateFunction = controlTemplate;
}
export default CaptionPosition;
