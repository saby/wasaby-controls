import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Paste/Paste');

class Paste extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _complicate(): void {
        const complicatingValue: string = Math.random().toString(36).substr(2, 3);
        this._children.password.paste(complicatingValue);
    }
}

export default Paste;
