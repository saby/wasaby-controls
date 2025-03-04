import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IBackOptions } from 'Controls/heading';
import * as template from 'wml!Controls-ListEnv/_breadcrumbs/Back/WidgetWrapper';

interface IBreadcrumbsBackProps extends IBackOptions, IControlOptions {
    storeId?: string;
}

export default class BreadCrumbsWrappedView extends Control<IBreadcrumbsBackProps> {
    protected _template: TemplateFunction = template;
}
