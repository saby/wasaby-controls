/**
 * @kaizen_zone 49e4d90e-38bb-4029-bdfb-9dd08e44fa83
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupSliding/ScrollWrapper/ScrollWrapper';
import { ISlidingPanelTemplateOptions } from 'Controls/_popupSliding/interface/ISlidingPanelTemplate';
import { SyntheticEvent } from 'UI/Vdom';
/**
 * Контейнер в который нужно обернуть Controls/scroll:Container,
 * в случае если он находится не в корне пользовательского шаблона задаваемого в опции {@link Controls/_popupSliding/interface/ISlidingPanelTemplate#bodyContentTemplate bodyContentTemplate}
 * @class Controls/_popupSliding/ScrollWrapper
 * @public
 * @demo Controls-demo/PopupTemplate/SlidingPanel/ScrollWrapper/Index
 */
export default class Template extends Control<ISlidingPanelTemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _scrollStateChangedHandler(
        event: SyntheticEvent<MouseEvent>,
        scrollState: object
    ): void {
        this._notify('_slidingPanelScrollStateChanged', [scrollState], {
            bubbling: true,
        });
    }
}
