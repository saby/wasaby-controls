import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/ItemTemplate/IconsItemTemplate');
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import 'css!Controls-demo/dropdown_new/Button/ItemTemplate/Index';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: [
                { id: 4, icon: 'icon-PhoneCell' },
                { id: 5, icon: 'icon-CreateFolder' },
                { id: 6, icon: 'icon-Scan' },
                { id: 7, icon: 'icon-Sandclock' },
                { id: 8, icon: 'icon-Trade' },
                { id: 9, icon: 'icon-BadToGood' },
                { id: 10, icon: 'icon-Successful' },
                { id: 11, icon: 'icon-Decline' },
                { id: 12, icon: 'icon-Admin' },
            ],
        });
    }

    protected _itemClick(event: Event, item: Model, sourceEvent: Event): void {
        this._notify('itemClick', [item, sourceEvent]);
    }
}
