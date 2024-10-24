/**
 * @kaizen_zone 49e4d90e-38bb-4029-bdfb-9dd08e44fa83
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

    protected _applyButtonClickHandler(event: Event): void {
        if (this._options.applyButtonCallback) {
            this._options.applyButtonCallback(event);
        }
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
