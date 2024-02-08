import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/Source/IconSize/Index');
import { Memory } from 'Types/source';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _selectedKeys: string[] = ['2'];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: '1',
                    icon: 'icon-EmptyMessage',
                    iconStyle: 'info',
                    iconSize: 'm',
                    title: 'Message',
                },
                {
                    key: '2',
                    title: 'Report',
                },
                {
                    key: '3',
                    icon: 'icon-TFTask',
                    iconSize: 'm',
                    title: 'Task',
                },
                {
                    key: '4',
                    title: 'News',
                    readOnly: true,
                },
            ],
        });
    }
}
