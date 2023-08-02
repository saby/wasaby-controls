/**
 * @kaizen_zone 5d04426f-0434-472a-b02c-eecab5eb3c36
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupSliding/Template/Stack/SlidingStackTemplate';
import { ISlidingPanelTemplateOptions } from 'Controls/_popupSliding/interface/ISlidingPanelTemplate';

export default class SlidingPanel extends Control<ISlidingPanelTemplateOptions> {
    protected _template: TemplateFunction = template;

    protected _getBackgroundClass(): string {
        return this._options.backgroundStyle === 'default'
            ? 'controls-SlidingPanel_backgroundStyle-default'
            : 'controls-background-' + this._options.backgroundStyle;
    }

    protected _closePopup(): void {
        this._notify('close', [], { bubbling: true });
    }

    static getDefaultOptions(): Partial<ISlidingPanelTemplateOptions> {
        return {
            slidingPanelOptions: {
                desktopMode: 'stack',
            },
            backgroundStyle: 'default',
            closeButtonVisible: true,
        };
    }
}
