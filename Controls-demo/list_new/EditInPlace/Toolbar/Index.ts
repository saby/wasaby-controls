import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/Toolbar/Toolbar';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'UICommon/Events';
import { IItemAction } from 'Controls/itemActions';
import { Model } from 'Types/entity';
import { Logger } from 'UI/Utils';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    protected _onActionClick(
        e: SyntheticEvent,
        itemAction: IItemAction,
        item: Model
    ): void {
        Logger.error(
            'Should not fire actionClick event by click editing buttons'
        );
    }
}
