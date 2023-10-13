import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'UICommon/Events';
import { ItemsEntity } from 'Controls/dragnDrop';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getGroupedCatalog as getData } from '../../DemoHelpers/Data/Groups';

import * as Template from 'wml!Controls-demo/list_new/Grouped/DnD/DnD';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GroupedDnD: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
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
