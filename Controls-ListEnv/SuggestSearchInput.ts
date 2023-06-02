import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_SuggestSearchInput/WidgetWrapper';

export default class SearchWidget extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
