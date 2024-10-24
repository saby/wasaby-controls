import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Popup/PreviewerTarget/ReadOnly/ReadOnly';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _text: string = 'text';
}

export default Base;
