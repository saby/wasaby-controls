import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_filterPanel/WidgetWrapper';

/**
 * Контрол-контейнер для виджета панели фильтров. Передает опции из контекста в контрол.
 * @class Controls-ListEnv/_filterPanel/WidgetWrapper
 * @extends UI/Base:Control
 * @private
 */
export default class FilterPanelWidgetWrapper extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
