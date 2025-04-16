import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Heading/PaddingSize/PaddingSize');
import 'css!Controls-demo/Spoiler/Heading/PaddingSize/Index';

class PaddingSize extends Control<IControlOptions> {
    protected _expanded1: boolean = true;
    protected _expanded2: boolean = true;

    protected _template: TemplateFunction = controlTemplate;
}
export default PaddingSize;
