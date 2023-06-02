/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanel/View/WrappedContainer';

/**
 * Контрол-контейнер для панели фильтра. Передает опции из контекста в панель.
 * @class Controls/_filterPanel/View/WrappedContainer
 * @extends UI/Base:Control
 * @private
 */
export default class ViewContainerWrapper extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
