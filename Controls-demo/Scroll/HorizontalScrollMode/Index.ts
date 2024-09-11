import { Control, IControlOptions, TemplateFunction } from 'UI/Base';

import * as controlTemplate from 'wml!Controls-demo/Scroll/HorizontalScrollMode/Template';

export default class HorizontalScrollModeDemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
