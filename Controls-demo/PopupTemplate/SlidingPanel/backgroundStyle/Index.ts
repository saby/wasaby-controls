import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/SlidingPanel/backgroundStyle/backgroundStyle');
import { detection } from 'Env/Env';

class BackgroundStyle extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _slidingPanelOptions: object = {
        position: 'bottom',
        desktopMode: 'dialog',
        isMobileMode: true,
    };
    protected _originIsMobile: boolean;

    protected _beforeMount(): void {
        this._originIsMobile = detection.isPhone;
        // По умолчанию показываем версию для мобилки
        detection.isPhone = true;
    }
    protected _beforeUnmount(): void {
        // На случай если в демках появится SPA, чтобы не поломать другие демки
        detection.isPhone = this._originIsMobile;
    }
}

export default BackgroundStyle;
