import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_navigation/widget/NavigationWrapper';

export default class NavigationWidget extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
