import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Popup/Open/SelectorTemplate/Index');
import { RecordSet, List } from 'Types/collection';
import { Memory } from 'Types/source';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { Button } from 'Controls/buttons';
import { StackOpener, StickyOpener } from 'Controls/popup';

class SelectorTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _items: object[] = [
        { key: 1, title: 'Banking and financial services, credit' },
        {
            key: 2,
            title: 'Gasoline, diesel fuel, light oil products',
            comment: 'comment',
        },
        { key: 3, title: 'Transportation, logistics, customs' },
        { key: 4, title: 'Oil and oil products', comment: 'comment' },
        {
            key: 5,
            title: 'Pipeline transportation services',
            comment: 'comment',
        },
        {
            key: 6,
            title: 'Services in tailoring and repair of clothes, textiles',
        },
        {
            key: 7,
            title: 'Computers and components, computing, office equipment',
        },
    ];
    protected _selectorItems: object[] = [...this._items];
    protected _navigation: object = {
        view: 'page',
        source: 'page',
        sourceConfig: {
            pageSize: 4,
            page: 0,
            hasMore: false,
        },
    };
    protected _selectedKeys: number[] = [3];
    protected _children: {
        button: Button;
    };

    protected _openMenu(): void {
        const stickyOpener = new StickyOpener();
        stickyOpener.open({
            template: 'Controls/menu:Popup',
            templateOptions: {
                selectedKeys: this._selectedKeys,
                markerVisibility: 'onactivated',
                source: new Memory({
                    keyProperty: 'key',
                    data: this._items,
                }),
                navigation: this._navigation,
                keyProperty: 'key',
                displayProperty: 'title',
                selectorTemplate: {
                    templateName: 'Controls-demo/Menu/Popup/Open/SelectorTemplate/StackTemplate',
                },
                selectorDialogResult: this._resultSelectorTemplate.bind(this),
                eventHandlers: {
                    onResult: (action: string, data: Model) => {
                        if (action === 'openSelectorDialog') {
                            this._moreButtonClick(data);
                        }
                        stickyOpener.close();
                    },
                },
            },
            target: this._children.button,
            opener: this,
        });
    }

    protected _moreButtonClick(selectedItems: List<Model>): void {
        const config = {
            closeOnOutsideClick: true,
            templateOptions: {
                selectedItems,
                items: this._selectorItems,
            },
            opener: this._children.button,
            template: 'Controls-demo/Menu/Popup/Open/SelectorTemplate/StackTemplate',
            eventHandlers: {
                onResult: (result) => {
                    this._resultSelectorTemplate(result);
                },
            },
        };
        const stackOpener = new StackOpener();
        stackOpener.open(config);
    }

    protected _resultSelectorTemplate(items: RecordSet): void {
        this._selectedKeys = [];
        factory(items).each((item) => {
            const selectItemIndex = this._items.findIndex(
                (menuItem) => menuItem.key === item.getKey()
            );
            [this._items[0], this._items[selectItemIndex]] = [
                this._items[selectItemIndex],
                this._items[0],
            ];
            return this._selectedKeys.push(item.getKey());
        });
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
export default SelectorTemplate;
