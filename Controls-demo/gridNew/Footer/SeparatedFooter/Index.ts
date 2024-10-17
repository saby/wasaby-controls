import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Footer/SeparatedFooter/SeparatedFooter';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IItemAction } from 'Controls/interface';
import {
    getActionsForContacts as getItemActions,
    getMoreActions,
} from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(0, 7);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _fullColumns: IColumn[] = Countries.getColumns();
    protected _smallColumns: IColumn[] = Countries.getColumns().slice(0, 4);
    protected _itemActions: IItemAction[] = [...getItemActions(), ...getMoreActions()];

    protected _beforeMount(): void {
        this._smallColumns[0].width = '30px';

        this._fullColumns[0].width = '30px';
        this._fullColumns[1].cellPadding = {
            left: 'S',
            right: 'null',
        };
        this._fullColumns[2].width = '80px';
        this._fullColumns[3].width = '100px';
        this._fullColumns[4].width = '80px';
        this._fullColumns[5].width = '80px';
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            FooterSeparatedFooter: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
            FooterSeparatedFooter1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
