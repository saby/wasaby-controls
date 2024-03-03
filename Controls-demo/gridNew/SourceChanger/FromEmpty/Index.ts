import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/SourceChanger/FromEmpty/FromEmpty';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { ChangeSourceData } from 'Controls-demo/gridNew/DemoHelpers/Data/ChangeSource';
import DemoSource from './DemoSource';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue, IContextValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return ChangeSourceData.getData2();
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    private _viewSource2: Memory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'key',
            width: '50px',
        },
        {
            displayProperty: 'load',
            width: '200px',
        },
    ];
    private _resolve: unknown = null;

    protected _beforeMount(): void {
        this._viewSource2 = new DemoSource({
            keyProperty: 'key',
            data: getData(),
        });
    }

    protected _onPen(): void {
        const self = this;
        this._resolve();
        this._viewSource2.pending = new Promise((res) => {
            self._resolve = res;
        });
    }

    protected _onChangeSource() {
        const self = this;
        this._viewSource2.pending = new Promise((res) => {
            self._resolve = res;
        });
        this._viewSource2.queryNumber = 0;
        this._getSlice().setState({
            source: this._viewSource2,
        });
    }

    private _getSlice(): IContextValue {
        return this._options._dataOptionsValue.SourceChangerFromEmpty;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SourceChangerFromEmpty: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new DemoSource({
                        keyProperty: 'key',
                        filterData: getData(),
                        data: [],
                    }),
                    navigation: {
                        source: 'page',
                        view: 'maxCount',
                        sourceConfig: {
                            pageSize: 10,
                            page: 0,
                        },
                        viewConfig: {
                            maxCountValue: 3,
                        },
                    },
                },
            },
        };
    },
});
