import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/SelectedKeys/MultiSelect/Index');
import { Memory } from 'Types/source';

class SelectedKeys extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
                { key: 1, title: 'Administrator' },
                { key: 2, title: 'Moderator' },
                { key: 3, title: 'Participant' },
                { key: 4, title: 'Subscriber' },
            ],
            keyProperty: 'key',
        });
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
export default SelectedKeys;
