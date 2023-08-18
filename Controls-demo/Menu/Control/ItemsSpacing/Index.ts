import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Menu/Control/ItemsSpacing/Index';
import { Memory } from 'Types/source';

class Source extends Control {
    protected _template: TemplateFunction = template;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
                {
                    key: 1,
                    title: 'Administrator',
                    icon: 'icon-small icon-AdminInfo',
                },
                { key: 2, title: 'Moderator' },
                { key: 3, title: 'Participant' },
                {
                    key: 4,
                    title: 'Subscriber',
                    icon: 'icon-small icon-Subscribe',
                },
            ],
            keyProperty: 'key',
        });
    }
}
export default Source;
