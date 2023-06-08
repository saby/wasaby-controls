/**
 * @kaizen_zone 5d04426f-0434-472a-b02c-eecab5eb3c36
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupSliding/Template/Template';
import { ISlidingPanelTemplateOptions } from 'Controls/_popupSliding/interface/ISlidingPanelTemplate';
import { getConfig } from 'Application/Env';
import { detection } from 'Env/Env';

export enum DESKTOP_MODE {
    STACK = 'stack',
    DIALOG = 'dialog',
    STICKY = 'sticky',
}

const DESKTOP_TEMPLATE_BY_MODE = {
    [DESKTOP_MODE.DIALOG]: 'Controls/popupTemplate:Dialog',
    [DESKTOP_MODE.STACK]: 'Controls/popupTemplate:Stack',
    [DESKTOP_MODE.STICKY]: 'Controls/popupTemplate:Sticky',
};

const MOBILE_TEMPLATE_DIALOG = 'Controls/popupSliding:_SlidingPanel';
const MOBILE_TEMPLATE_STACK = 'Controls/popupSliding:_SlidingStackPanel';

/**
 *  Базовый шаблон окна-шторки.
 *  @remark
 *  Для корректной работы требуется:
 *    1) Задать опцию {@link Controls/_popupSliding/interface/ISlidingPanelTemplate#slidingPanelOptions slidingPanelOptions}
 *    2) Если скролл находится не в корне {@link Controls/_popupSliding/interface/ISlidingPanelTemplate#bodyContentTemplate bodyContentTemplate},
 *    то нужно проксировать выше событие ScrollContainer scrollStateChanged
 *  В зависимости от переданного значения в slidingPanelOptions.desktopMode, контрол может принимать опции, которые поддерживает окно.
 *  @see Controls/PopupTemplate:Dialog
 *  @see Controls/PopupTemplate:Stack
 *  @see Controls/PopupTemplate:Sticky
 * @implements Controls/popupSliding:ISlidingPanelTemplate
 * @implements Controls/popupTemplate:IPopupTemplateBase
 * @public
 * @demo Controls-demo/PopupTemplate/SlidingPanel/Index
 */
export default class Template extends Control<ISlidingPanelTemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _adaptiveTemplateName: string;
    protected _isAdaptive: boolean = getConfig('isAdaptive');

    protected _beforeMount(options: ISlidingPanelTemplateOptions): void {
        this._adaptiveTemplateName = this._getAdaptiveTemplate(
            options.slidingPanelOptions
        );
    }

    protected _beforeUpdate(options: ISlidingPanelTemplateOptions): void {
        if (
            options.slidingPanelOptions &&
            options.slidingPanelOptions !== this._options.slidingPanelOptions
        ) {
            this._adaptiveTemplateName = this._getAdaptiveTemplate(
                options.slidingPanelOptions
            );
        }
    }

    private _getAdaptiveTemplate(
        slidingPanelOptions: ISlidingPanelTemplateOptions['slidingPanelOptions']
    ): string {
        if (this._isAdaptive || detection.isPhone) {
            return slidingPanelOptions.desktopMode === 'stack'
                ? MOBILE_TEMPLATE_STACK
                : MOBILE_TEMPLATE_DIALOG;
        }
        return DESKTOP_TEMPLATE_BY_MODE[slidingPanelOptions.desktopMode];
    }
}
