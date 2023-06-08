import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'UICommon/Events';
import { ItemsEntity } from 'Controls/dragnDrop';

import { getGroupedCatalog as getData } from '../../DemoHelpers/Data/Groups';

import * as Template from 'wml!Controls-demo/list_new/Grouped/DnD/DnD';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: ItemsEntity,
        target: unknown,
        position: string
    ): void {
        this._children.listMover.moveItems(entity.getItems(), target, position);
    }
}
