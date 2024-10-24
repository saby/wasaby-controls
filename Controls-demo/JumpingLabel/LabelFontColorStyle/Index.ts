import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/JumpingLabel/LabelFontColorStyle/Index');

import 'Controls/input';

class LabelFontColorStyle extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _firstValue: string = 'my name';
    protected _secondValue: string = 'my name';
    protected _thirdValue: string = 'my name';
    protected _fourthValue: string = 'my name';
    protected _fifthValue: string = 'my name';
    protected _sixthValue: string = 'my name';
}

export default LabelFontColorStyle;
