import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/Handlers/Handlers';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'UICommon/Events';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _events: string[] = [];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    protected _itemEventHandler(
        event: SyntheticEvent,
        eventName: string,
        item: Model
    ): void {
        const eventDescription = `${eventName} on item=${item.getKey()}`;
        const eventIsLast =
            this._events.lastIndexOf(eventDescription) ===
            this._events.length - 1;
        if (!this._events.length || !eventIsLast) {
            this._events.push(eventDescription);
        }
    }

    protected _clearOutput(): void {
        this._events = [];
    }
}
