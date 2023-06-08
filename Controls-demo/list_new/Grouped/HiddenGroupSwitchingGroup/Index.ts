import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { groupConstants } from 'Controls/list';
import { IItemAction } from 'Controls/itemActions';
import { getGroupedCatalogForSwitchingGroup as getData } from '../../DemoHelpers/Data/HiddenGroup';
import * as Template from 'wml!Controls-demo/list_new/Grouped/HiddenGroupSwitchingGroup/HiddenGroupSwitchingGroup';
import { RecordSet } from 'Types/collection';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _items: RecordSet;
    protected _itemActions: IItemAction[] = [
        {
            id: 'archive',
            icon: 'icon-Archive',
            showType: 2,
            handler: this._switchGroup.bind(this),
        },
    ];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._onItemsReady = this._onItemsReady.bind(this);
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    protected _onItemsReady(items: RecordSet): void {
        this._items = items;
    }
    protected _switchGroup(item: Model): void {
        this._items.setEventRaising(false, true);
        item.set(
            'group',
            item.get('group') === 'Архив' ? groupConstants.hiddenGroup : 'Архив'
        );
        this._items.setEventRaising(true, true);
    }
}
