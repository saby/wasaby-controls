import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_frequentFilter/Chips/WidgetWrapper';

/**
 * Контрол-контейнер для виджета чипсов. Передает опции из контекста в контрол.
 * @class Controls-ListEnv/_frequentFilter/Chips/WidgetWrapper
 * @extends UI/Base:Control
 * @private
 */
export default class FilterChipsWidget extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
