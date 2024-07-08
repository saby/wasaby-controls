import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/SlidingPanel/Index/Index');
import { SyntheticEvent } from 'UI/Events';

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _isMobile: boolean = true;
    protected _originIsMobile: boolean;
    protected _slidingPanelOptions: object = {
        position: 'bottom',
        desktopMode: 'dialog',
        isMobileMode: this._isMobile,
    };
    protected _isMobileChanged(event: SyntheticEvent, value: boolean): void {
        this._isMobile = value;
        this._slidingPanelOptions = {
            ...this._slidingPanelOptions,
            ...{ isMobileMode: value },
        };
    }
    static _styles: string[] = ['Controls-demo/PopupTemplate/SlidingPanel/Index/Index'];
}

export default Index;
