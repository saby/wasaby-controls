import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/Popup/SlidingPanel/StackTemplate/StackTemplate';
import { SlidingPanelOpener } from 'Controls/popup';

class StackTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _dialogOpener: SlidingPanelOpener;

    protected _afterMount(): void {
        this._dialogOpener = new SlidingPanelOpener();
    }

    protected _openSlidingPanelHandler(): void {
        this._dialogOpener.open({
            template: 'Controls-demo/Popup/SlidingPanel/StackTemplate',
            opener: this,
            desktopMode: 'stack',
            dialogOptions: {
                width: 900,
            },
        });
    }
}
export default StackTemplate;
