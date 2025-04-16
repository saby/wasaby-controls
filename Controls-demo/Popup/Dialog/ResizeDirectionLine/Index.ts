import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Dialog/ResizeDirectionLine/Index');
import { DialogOpener } from 'Controls/popup';
import { RecordSet } from 'Types/collection';

const baseStackConfig = {
    template: 'Controls-demo/Popup/Dialog/ResizeDirectionLine/Popup',
    closeOnOutsideClick: true,
    opener: null,
};

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _position: string = 'right';
    protected _itemsPosition: RecordSet;
    private _dialogOpener: DialogOpener;

    protected _beforeMount(): void {
        this._itemsPosition = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 'right',
                    title: 'right',
                },
                {
                    id: 'bottom',
                    title: 'bottom',
                },
                {
                    id: 'left-right',
                    title: 'left-right',
                },
            ]
        });
    }

    protected _afterMount(): void {
        this._dialogOpener = new DialogOpener();
    }

    protected _openDialogHandler(): void {
        this._dialogOpener.open({
            ...baseStackConfig,
            templateOptions: {
                resizingOptions: {
                    position: this._position
                },
            },
        });
    }
}

export default Index;
