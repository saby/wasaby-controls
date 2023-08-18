import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/KeepScrollAfterReload/KeepScrollAfterReload';
import { CrudEntityKey, Memory } from 'Types/source';
import { generateData } from '../DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

interface IItem {
    title: string;
    key: CrudEntityKey;
    filtered: boolean;
}

function getData(): IItem[] {
    return generateData({
        count: 50,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `${item.key}) item`;
            item.filtered = true;
        },
    });
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _filter: object;

    protected _changeFilter(): void {
        if (!this._filter) {
            this._filter = { filtered: true };
        } else {
            this._filter = null;
        }
        this._options._dataOptionsValue.KeepScrollAfterReload.setFilter(this._filter);
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            KeepScrollAfterReload: {
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
    },
});
