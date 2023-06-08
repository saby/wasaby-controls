/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls/_filter/View/WrappedContainer';

export default class ViewContainerWrapper extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
