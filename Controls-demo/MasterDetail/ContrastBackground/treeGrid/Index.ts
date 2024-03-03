import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls-demo/MasterDetail/ContrastBackground/treeGrid/Index');
import { master } from 'Controls-demo/MasterDetail/Data';
import * as cClone from 'Core/core-clone';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { SyntheticEvent } from 'UI/Vdom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as DemoSource from 'Controls-demo/MasterDetail/DemoSource';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue
}

function getMasterData() {
    return cClone(master);
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _markedKey: number = 0;
    protected _itemActions: IItemAction[];
    protected _gridColumns: object[];

    protected _beforeMount(): void {
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-ExpandDown',
                title: 'view',
            },
        ];

        this._gridColumns = [
            {
                displayProperty: 'name',
                width: '1fr',
            },
        ];
    }

    protected _onMarkedKeyChanged(e: SyntheticEvent<Event>, key: number): void {
        this._options._dataOptionsValue.detail.setFilter({
            myOpt: key,
        });
    }

    static _styles: string[] = ['Controls-demo/MasterDetail/Demo'];
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            master: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getMasterData(),
                    }),
                    markerVisibility: 'visible',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                },
            },
            detail: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new DemoSource({ keyProperty: 'id' }),
                    filter: {
                        myOpt: '0',
                    },
                },
            },
        };
    }
});
