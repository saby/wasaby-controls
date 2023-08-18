import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls-demo/MasterDetail/Base/Index');
import { SyntheticEvent } from 'UI/Vdom';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getMasterData() {
    return [
        {
            id: 'incoming',
            title: 'Входящие',
            sourceType: 'incoming',
        },
        {
            id: 'incomingTasks',
            title: 'Входящие задачи',
            sourceType: 'incomingTasks',
        },
    ];
}

function getDetailData() {
    return [
        {
            id: '0',
            title: 'Ошибка в разработку',
            sourceType: 'incoming',
        },
        {
            id: '1',
            title: 'Аттестация',
            sourceType: 'incoming',
        },
        {
            id: '1',
            title: 'Задача в разработку',
            sourceType: 'incomingTasks',
        },
    ];
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;

    protected _onMarkedKeyChanged(e: SyntheticEvent<Event>, key: number): void {
        this._options._dataOptionsValue.Basedetail.setFilter({
            sourceType: key,
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo', 'Controls-demo/MasterDetail/Demo'];
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Basemaster: {
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
            Basedetail: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getDetailData(),
                    }),
                },
            },
        };
    },
});
