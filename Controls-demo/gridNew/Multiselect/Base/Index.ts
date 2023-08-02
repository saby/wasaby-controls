import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as Template from 'wml!Controls-demo/gridNew/Multiselect/Base/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue
}

interface IColumn {
    displayProperty: string;
}

const { getData } = Countries;

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _radioSource: Memory;
    protected _columns: IColumn[] = Countries.getColumns();
    protected _selectedKey: string = 'visible';

    protected _beforeMount(): void {
        this._radioSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 'visible',
                    title: 'multiSelectVisibility = visible',
                },
                {
                    id: 'hidden',
                    title: 'multiSelectVisibility = hidden',
                },
                {
                    id: 'onhover',
                    title: 'multiSelectVisibility = onhover',
                },
            ],
        });
    }

    protected _onSelectedKeyChanged(
        event: SyntheticEvent,
        key: string
    ): void {
        this._selectedKey = key;
        this._options._dataOptionsValue.listData0.setState({
            multiSelectVisibility: key,
        })
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'visible'
                },
            },
        };
    }
})
