import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/ItemTemplate/Index');
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _selectedIcon: string;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: [
                { id: 1, title: 'С компьютера', icon: 'icon-TFComputer' },
                { id: 2, title: 'Из документов', icon: 'icon-Unfavorite' },
                { id: 3, title: 'Из коллекции', icon: 'icon-Album' },
                {
                    id: 4,
                    readOnly: true,
                    template:
                        'Controls-demo/dropdown_new/Button/ItemTemplate/IconsItemTemplate',
                },
            ],
        });
    }

    protected _itemChoose(event: Event, item: Model): void {
        this._selectedIcon = item.get('icon');
    }
}
