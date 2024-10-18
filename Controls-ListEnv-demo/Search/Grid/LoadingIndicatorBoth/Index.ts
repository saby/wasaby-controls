import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'UI/Vdom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import PortionedSearchMemory from './PortionedSearchMemory';
import * as Template from 'wml!Controls-ListEnv-demo/Search/Grid/LoadingIndicatorBoth/Search';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [{ displayProperty: 'title' }];

    protected _littleData: boolean = false;
    protected _moreUpTrueAndWithoutData: boolean = false;

    protected _littleDataChangedHandler(event: SyntheticEvent, newValue: boolean): void {
        this._moreUpTrueAndWithoutData = false;
        const source = this._options._dataOptionsValue.LoadingIndicatorBothSearch.source;
        source.setLittleData(newValue);
    }

    protected _moreUpTrueAndWithoutDataChangedHandler(
        event: SyntheticEvent,
        newValue: boolean
    ): void {
        this._littleData = false;
        const source = this._options._dataOptionsValue.LoadingIndicatorBothSearch.source;
        source.setMoreUpTrueAndWithoutData(newValue);
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadingIndicatorBothSearch: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PortionedSearchMemory({ keyProperty: 'key' }),
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        sourceConfig: {
                            field: 'key',
                            position: 0,
                            direction: 'bothways',
                            limit: 20,
                        },
                    },
                    searchParam: 'title',
                    minSearchLength: 3,
                },
            },
        };
    },
});
