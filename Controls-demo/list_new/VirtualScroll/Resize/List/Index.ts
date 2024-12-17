import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/Resize/List/List';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

interface IItem {
    key: number;
    title: string;
}

function getData(): IItem[] {
    return generateData<IItem>({
        count: 100,
        entityTemplate: { title: 'number' },
        beforeCreateItemCallback(item: IItem): void {
            item.title = `Запись #${item.key}`;
        },
    });
}

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getMemory(): Memory {
    return new Memory({
        keyProperty: 'key',
        data: getData(),
    });
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _virtualScrollConfig: { pageSize: number } = { pageSize: 20 };

    protected _changeOptions(): void {
        this._options._dataOptionsValue.VirtualScrollResizeList.setState({
            source: getMemory(),
        });
        this._virtualScrollConfig = {
            pageSize: 1,
        };
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollResizeList: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: getMemory(),
                },
                navigation: {
                    view: 'infinity',
                },
            },
        };
    },
});
