import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Heading/PaddingSize/PaddingSize');
import 'css!Controls-demo/Spoiler/Heading/PaddingSize/Index';

class PaddingSize extends Control<IControlOptions> {
    protected _expanded: boolean = true;

    protected _template: TemplateFunction = controlTemplate;
}
export default PaddingSize;
