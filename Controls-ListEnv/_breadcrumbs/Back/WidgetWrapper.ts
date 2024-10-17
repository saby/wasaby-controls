import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_breadcrumbs/Back/WidgetWrapper';

export default class BreadCrumbsWrappedView extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
