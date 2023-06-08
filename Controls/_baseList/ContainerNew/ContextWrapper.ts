/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls/_baseList/ContainerNew/ContextWrapper';

export default class ListContextWrapper extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
