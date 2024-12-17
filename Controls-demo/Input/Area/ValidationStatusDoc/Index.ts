import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/Input/Area/ValidationStatusDoc/Index';

export default class ValidationStatus extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
