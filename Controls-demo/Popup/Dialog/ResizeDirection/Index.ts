import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Dialog/ResizeDirection/Index');
import { DialogOpener } from 'Controls/popup';

const baseStackConfig = {
    template: 'Controls-demo/Popup/Dialog/ResizeDirection/Popup',
    closeOnOutsideClick: true,
    autofocus: true,
    opener: null,
    maxWidth: 600,
    maxHeight: 400,
};

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _vertical: boolean = false;
    protected _horizontal: boolean = false;
    private _dialogOpener: DialogOpener;

    protected _afterMount(options?: IControlOptions, contexts?: any): void {
        this._dialogOpener = new DialogOpener();
    }

    protected _openDialogHandler(): void {
        this._dialogOpener.open({
            ...baseStackConfig,
            resizeDirection: {
                horizontal: this._horizontal ? 'left' : 'right',
                vertical: this._vertical ? 'top' : 'bottom',
            },
        });
    }
}
export default Index;
