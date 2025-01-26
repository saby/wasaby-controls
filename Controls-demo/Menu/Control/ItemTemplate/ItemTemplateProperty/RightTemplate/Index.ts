import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
// eslint-disable-next-line max-len
import controlTemplate = require('wml!Controls-demo/Menu/Control/ItemTemplate/ItemTemplateProperty/RightTemplate/Index');
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import 'wml!Controls-demo/Menu/Control/ItemTemplate/ItemTemplateProperty/ItemTpl';
import { Confirmation } from 'Controls/popup';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                { key: '1', title: 'Save', icon: 'icon-Save' },
                { key: '2', title: 'Execute', icon: 'icon-Show' },
                {
                    key: '3',
                    title: 'Discuss',
                    icon: 'icon-EmptyMessage',
                    addIcon: 'icon-VideoCallNull',
                    template:
                        'wml!Controls-demo/Menu/Control/ItemTemplate/ItemTemplateProperty/ItemTpl',
                },
                { key: '4', title: 'For control', icon: 'icon-Sent2' },
            ],
            keyProperty: 'key',
        });
    }

    protected _rightTemplateClick(event: Event, item: Model): void {
        Confirmation.openPopup({
            message: `Клик по команде пункта "${item.get('title')}"`,
            type: 'ok',
        });
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
