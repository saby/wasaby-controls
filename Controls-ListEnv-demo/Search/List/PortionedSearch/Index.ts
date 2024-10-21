import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import { Memory } from 'Types/source';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-ListEnv-demo/Search/List/PortionedSearch/PortionedSearch';
import PortionedSearchMemory from 'Controls-ListEnv-demo/Search/List/DataHelpers/PortionedSearchMemory';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

const fastFilterData = [
    {
        name: 'filter',
        value: null,
        resetValue: null,
        emptyText: 'Все',
        editorOptions: {
            source: new Memory({
                keyProperty: 'id',
                data: [
                    {
                        id: 'few-items',
                        title: 'Мало записей',
                    },
                ],
            }),
            displayProperty: 'title',
            keyProperty: 'id',
        },
        viewMode: 'frequent',
    },
];

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: PortionedSearchMemory = null;
    protected _fastFilterData: object[];
    protected _filter: Object = null;
    protected _position: number = 0;

    protected _longLoad: boolean = false;
    protected _fastLoad: boolean = false;
    protected _moreDataOnLoad: boolean = false;

    protected _beforeMount(): void {
        this._fastFilterData = fastFilterData;
    }

    protected _longLoadChangedHandler(event: SyntheticEvent, newValue: boolean): void {
        this.props._dataOptionsValue.source.setLongLoad(newValue);
        this._fastLoad = false;
        this._moreDataOnLoad = false;
    }

    protected _fastLoadChangedHandler(event: SyntheticEvent, newValue: boolean): void {
        this.props._dataOptionsValue.source.setFastLoad(newValue);
        this._longLoad = false;
        this._moreDataOnLoad = false;
    }

    protected _moreDataOnLoadChangedHandler(event: SyntheticEvent, newValue: boolean): void {
        this.props._dataOptionsValue.source.setMoreDataOnLoad(newValue);
        this._fastLoad = false;
        this._longLoad = false;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SearchingPortionedSearch: {
                dataFactoryName:
                    'Controls-ListEnv-demo/Search/List/DataHelpers/PortionedSearchCustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PortionedSearchMemory({
                        direction: 'down',
                        keyProperty: 'key',
                    }),
                    filter: {},
                    searchParam: 'title',
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        sourceConfig: {
                            field: 'key',
                            position: 0,
                            direction: 'forward',
                            limit: 20,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                    filterButtonSource: fastFilterData,
                    minSearchLength: 3,
                },
            },
        };
    },
});
