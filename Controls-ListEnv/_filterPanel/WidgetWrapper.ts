import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_filterPanel/WidgetWrapper';
import { IInnerWidgetOptions } from 'Controls-ListEnv/filterBase';

/**
 * Контрол-контейнер для виджета панели фильтров. Передает опции из контекста в контрол.
 * @class Controls-ListEnv/_filterPanel/WidgetWrapper
 * @extends UI/Base:Control
 * @private
 */
export default class FilterPanelWidgetWrapper extends Control<IInnerWidgetOptions> {
    protected _template: TemplateFunction = template;
}
