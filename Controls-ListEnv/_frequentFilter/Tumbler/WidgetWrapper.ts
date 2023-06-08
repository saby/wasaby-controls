import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_frequentFilter/Tumbler/WidgetWrapper';

/**
 * Контрол-контейнер для виджета переключателя фильтров. Передает опции из контекста в контрол.
 * @class Controls-ListEnv/_frequentFilter/Tumbler/WidgetWrapper
 * @extends UI/Base:Control
 * @private
 */
export default class FilterViewWidget extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
