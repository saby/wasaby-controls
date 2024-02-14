import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_breadcrumbs/WidgetWrapper';
import 'css!Controls-ListEnv/breadcrumbs';

export default class WidgetWrapper extends Control {
    protected _template: TemplateFunction = template;
}
