import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Dialog/ResizeDirectionLine/Index');
import { DialogOpener } from 'Controls/popup';

const baseStackConfig = {
    template: 'Controls-demo/Popup/Dialog/ResizeDirectionLine/Popup',
    closeOnOutsideClick: true,
    opener: null,
};

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _position: boolean = false;
    private _dialogOpener: DialogOpener;

    protected _afterMount(): void {
        this._dialogOpener = new DialogOpener();
    }

    protected _openDialogHandler(): void {
        this._dialogOpener.open({
            ...baseStackConfig,
            templateOptions: {
                resizingOptions: {
                    position: this._position ? 'bottom' : 'right',
                },
            },
        });
    }
}

export default Index;
