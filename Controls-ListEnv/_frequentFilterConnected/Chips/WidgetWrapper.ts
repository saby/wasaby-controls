/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_frequentFilterConnected/Chips/WidgetWrapper';

/**
 * Контрол-контейнер для виджета чипсов. Передает опции из контекста в контрол.
 * @class Controls-ListEnv/_frequentFilterConnected/Chips/WidgetWrapper
 * @extends UI/Base:Control
 * @private
 */
export default class FilterChipsWidget extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
