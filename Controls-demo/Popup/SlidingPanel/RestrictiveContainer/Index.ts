import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/SlidingPanel/RestrictiveContainer/Index');
import { SlidingPanelOpener } from 'Controls/popup';

const config = {
    template: 'Controls-demo/Popup/SlidingPanel/PopupTemplate',
    desktopMode: 'stack',
    slidingPanelOptions: {
        position: 'bottom',
        heightList: [300, 400, 500],
    },
    dialogOptions: {
        width: 600,
    },
    templateOptions: {
        popupTemplate: 'Controls-demo/Popup/SlidingPanel/PopupTemplate/Content/LargeContent',
    },
};

class RestrictiveContainer extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _opener: SlidingPanelOpener = new SlidingPanelOpener({
        isAdaptive: false,
    });
    protected _insideRestrictiveContainer: boolean = true;

    protected _openSlidingPanelHandler(): void {
        const popupConfig = {
            ...config,
            opener: this,
        };
        if (this._insideRestrictiveContainer) {
            popupConfig.slidingPanelOptions = {
                ...popupConfig.slidingPanelOptions,
                restrictiveContainer:
                    '.ControlsDemo-Popup-slidingPanel_RestrictiveContainer-container',
            };
        }
        this._opener.open(popupConfig);
    }
    static _styles: string[] = ['Controls-demo/Popup/SlidingPanel/RestrictiveContainer/Index'];
}
export default RestrictiveContainer;
