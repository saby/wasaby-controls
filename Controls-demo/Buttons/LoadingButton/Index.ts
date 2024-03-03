import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Buttons/LoadingButton/LoadingButton');

class Loading extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Loading;
