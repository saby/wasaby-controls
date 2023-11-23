import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/SlidingPanel/HeaderContentTemplate/Index/Index');
import { SlidingPanelOpener } from 'Controls/popup';
import { SyntheticEvent } from 'UI/Events';

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _isMobile: boolean = true;
    protected _showToolbar: boolean = false;
    protected _showHeader: boolean = false;
    private _dialogOpener: SlidingPanelOpener;

    protected _afterMount(): void {
        this._dialogOpener = new SlidingPanelOpener({
            isAdaptive: !this._isMobile,
        });
    }
    protected _isMobileChanged(event: SyntheticEvent, value: boolean): void {
        this._isMobile = value;
        this._dialogOpener = new SlidingPanelOpener({
            isAdaptive: !this._isMobile,
        });
    }

    protected _selectedModeChanged(): void {
        this._dialogOpener = new SlidingPanelOpener({
            isAdaptive: !this._isMobile,
        });
    }

    protected _openSlidingPanelHandler(event: Event): void {
        this._dialogOpener.open({
            template:
                'Controls-demo/Popup/SlidingPanel/HeaderContentTemplate/PopupTemplate/PopupTemplate',
            opener: this,
            slidingPanelOptions: {
                heightList: [300, 500, 600],
            },
            dialogOptions: {
                width: 600,
            },
            templateOptions: {
                showHeader: this._showHeader,
                showToolbar: this._showToolbar,
            },
        });
    }
    static _styles: string[] = ['Controls-demo/Popup/SlidingPanel/Index/Index'];
}
export default Index;
