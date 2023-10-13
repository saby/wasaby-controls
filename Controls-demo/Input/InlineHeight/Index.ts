import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/InlineHeight/InlineHeight');

class SizesAndHeights extends Control<IControlOptions> {
    protected inlineHeightMValue: string = SizesAndHeights._defaultValue;
    protected inlineHeightLValue: string = SizesAndHeights._defaultValue;
    protected inlineHeightXLValue: string = SizesAndHeights._defaultValue;
    protected inlineHeight2XLValue: string = SizesAndHeights._defaultValue;
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue: string = 'text';
}

export default SizesAndHeights;
