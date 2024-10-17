import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls-demo/MasterDetail/MasterVisibility/Index');
import { master } from 'Controls-demo/MasterDetail/Data';
import * as cClone from 'Core/core-clone';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'UI/Vdom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as DemoSource from 'Controls-demo/MasterDetail/DemoSource';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getMasterData() {
    return cClone(master);
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _currentIcon: string = 'ArrangeList04';
    protected _masterVisibility: string = null;

    protected _toggleMaster(): void {
        this._currentIcon =
            this._currentIcon === 'ArrangeList04' ? 'ArrangeList03' : 'ArrangeList04';
        this._masterVisibility = this._masterVisibility === 'hidden' ? 'visible' : 'hidden';
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
    },
});
