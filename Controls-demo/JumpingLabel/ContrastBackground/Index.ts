import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/JumpingLabel/ContrastBackground/ContrastBackground');

import 'Controls/input';

class ContrastBackground extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default ContrastBackground;
