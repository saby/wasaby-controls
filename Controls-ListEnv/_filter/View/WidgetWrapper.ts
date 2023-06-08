import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_filter/View/WidgetWrapper';

/**
 * Контрол-контейнер для виджета объединенного фильтра. Передает опции из контекста в контрол.
 * @class Controls-ListEnv/_filter/View/WidgetWrapper
 * @extends UI/Base:Control
 * @private
 */
export default class FilterViewWidget extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
