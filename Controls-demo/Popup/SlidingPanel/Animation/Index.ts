import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SlidingPanelOpener } from 'Controls/popup';
import { Memory } from 'Types/source';
import controlTemplate = require('wml!Controls-demo/Popup/SlidingPanel/Animation/Index');

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _isMobile: boolean = true;
    protected _desktopMode: string[] = ['stack'];
    protected _animation: boolean = true;
    protected _desktopModeSource: Memory = new Memory({
        keyProperty: 'id',
        data: [{ id: 'stack' }, { id: 'dialog' }],
    });
    private _dialogOpener: SlidingPanelOpener;

    protected _afterMount(): void {
        this._dialogOpener = new SlidingPanelOpener({
            isAdaptive: false,
        });
    }

    protected _openSlidingPanelHandler(): void {
        this._dialogOpener.open({
            template: 'Controls-demo/Popup/SlidingPanel/PopupTemplate',
            opener: this,
            modal: true,
            desktopMode: this._desktopMode[0],
            animation: this._animation,
            slidingPanelOptions: {
                minHeight: 300,
                maxHeight: 700,
                position: 'bottom',
                autoHeight: false,
            },
            templateOptions: {
                popupTemplate:
                    'Controls-demo/Popup/SlidingPanel/PopupTemplate/Content/LargeContent',
            },
        });
    }

    static _styles: string[] = ['Controls-demo/Popup/SlidingPanel/Index/Index'];
}

export default Index;
