import { Control, IControlOptions, TemplateFunction } from 'UI/Base';

import * as controlTemplate from 'wml!Controls-demo/Scroll/VerticalScrollMode/Template';

export default class VerticalScrollModeDemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
