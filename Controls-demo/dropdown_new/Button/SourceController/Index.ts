import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/SourceController/Index');
import { Memory } from 'Types/source';
import { NewSourceController } from 'Controls/dataSource';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _sourceController: NewSourceController;

    protected _beforeMount(): unknown {
        this._sourceController = new NewSourceController({
            source: new Memory({
                keyProperty: 'key',
                data: [
                    {
                        key: '1',
                        icon: 'icon-EmptyMessage',
                        iconStyle: 'info',
                        title: 'Message',
                    },
                    {
                        key: '2',
                        title: 'Report',
                    },
                    {
                        key: '3',
                        icon: 'icon-TFTask',
                        title: 'Task',
                    },
                    {
                        key: '4',
                        title: 'News',
                        readOnly: true,
                    },
                    {
                        key: null,
                        title: 'Note',
                    },
                ],
            }),
            keyProperty: 'key',
        });
        return this._sourceController.load();
    }
    static _styles: string[] = ['Controls-demo/dropdown_new/Button/Index'];
}
