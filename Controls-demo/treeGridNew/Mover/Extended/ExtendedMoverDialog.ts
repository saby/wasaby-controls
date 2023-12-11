import { TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Mover/Extended/ExtendedMoverDialog/ExtendedMoverDialog';
import { RecordSet } from 'Types/collection';
import { IMoverDialogTemplateOptions, Template as MoverDialogTemplate } from 'Controls/moverDialog';
import { DialogOpener } from 'Controls/popup';
import { Direction } from 'Controls/interface';

export default class extends MoverDialogTemplate {
    static _styles: string[] = [
        'Controls-demo/treeGridNew/Mover/Extended/ExtendedMoverDialog/ExtendedMoverDialog',
    ];
    protected _template: TemplateFunction = Template;
    private _moverItemsCount: number;
    private _dialogOpener: DialogOpener;

    protected _beforeMount(options: IMoverDialogTemplateOptions): void {
        super._beforeMount(options);
        this._dialogOpener = new DialogOpener();
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
    }

    protected _dataLoadCallback(items: RecordSet, direction: Direction): void {
        super._dataLoadCallback(items, direction);
        this._moverItemsCount = items.getCount();
    }

    protected _createFolderButtonClick(): void {
        this._dialogOpener.open({
            opener: this,
            template: 'Controls-demo/treeGridNew/Mover/Extended/CreateDialog',
            eventHandlers: {
                onResult: (folderName): void => {
                    this._options.source
                        .update(
                            new RecordSet({
                                rawData: [
                                    {
                                        key: ++this._moverItemsCount,
                                        title: folderName,
                                        parent: null,
                                        type: true,
                                    },
                                ],
                            })
                        )
                        .then(() => {
                            this._children.explorer.reload();
                        });
                },
            },
        });
    }
}
