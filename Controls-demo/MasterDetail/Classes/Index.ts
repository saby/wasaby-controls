import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/MasterDetail/Classes/Index');
import { master } from 'Controls-demo/MasterDetail/Data';
import * as cClone from 'Core/core-clone';
import { IHeaderCell } from 'Controls/grid';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'UI/Vdom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as DemoSource from 'Controls-demo/MasterDetail/DemoSource';

function getMasterData() {
    return cClone(master);
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _markedKey: number = 0;
    protected _gridColumns: object[] = [
        {
            displayProperty: 'name',
            width: '1fr',
        },
    ];
    protected _header: IHeaderCell[] = [
        {
            caption: 'Имя',
        },
    ];

    protected _onMarkedKeyChanged(e: SyntheticEvent<Event>, key: number): void {
        this._options._dataOptionsValue.detail.setFilter({
            myOpt: key,
        });
    }

    static _styles: string[] = ['Controls-demo/MasterDetail/Demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
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
                    markedKey: 0,
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
}
