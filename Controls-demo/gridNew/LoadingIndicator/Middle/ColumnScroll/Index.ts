import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Middle/ColumnScroll/ColumnScroll';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import ManualResponseMemory from 'Controls-demo/gridNew/LoadingIndicator/Middle/ColumnScroll/ManualResponseMemory';
import { SyntheticEvent } from 'UI/Vdom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getColumnsWithScroll(): IColumn[] {
    return [
        {
            displayProperty: 'number',
            width: '40px',
        },
        {
            displayProperty: 'country',
            width: '300px',
        },
        {
            displayProperty: 'capital',
            width: '700px',
            compatibleWidth: '98px',
        },
        {
            width: '200px',
        },
        {
            displayProperty: 'population',
            width: '700px',
            compatibleWidth: '100px',
        },
        {
            displayProperty: 'square',
            width: '700px',
            compatibleWidth: '83px',
        },
        {
            displayProperty: 'populationDensity',
            width: '700px',
            compatibleWidth: '175px',
        },
    ];
}

function getHeaderWithColumnScroll(): IHeaderCell[] {
    return [
        {
            caption: '#',
            startRow: 1,
            endRow: 3,
            startColumn: 1,
            endColumn: 2,
        },
        {
            caption: 'Географические данные',
            startRow: 1,
            endRow: 2,
            startColumn: 2,
            endColumn: 4,
            align: 'center',
        },
        {
            caption: 'Страна',
            startRow: 2,
            endRow: 3,
            startColumn: 2,
            endColumn: 3,
        },
        {
            caption: 'Столица',
            startRow: 2,
            endRow: 3,
            startColumn: 3,
            endColumn: 4,
        },
        {
            caption: 'Колонка с выключенным перемещением мышью',
            startRow: 1,
            endRow: 3,
            startColumn: 4,
            endColumn: 5,
        },
        {
            caption: 'Цифры',
            startRow: 1,
            endRow: 2,
            startColumn: 5,
            endColumn: 8,
            align: 'center',
        },
        {
            caption: 'Население',
            startRow: 2,
            endRow: 3,
            startColumn: 5,
            endColumn: 6,
        },
        {
            caption: 'Площадь км2',
            startRow: 2,
            endRow: 3,
            startColumn: 6,
            endColumn: 7,
        },
        {
            caption: 'Плотность населения чел/км2',
            startRow: 2,
            endRow: 3,
            startColumn: 7,
            endColumn: 8,
        },
    ];
}

function getColumns(): IColumn[] {
    return [
        {
            displayProperty: 'number',
            width: '40px',
        },
        {
            displayProperty: 'country',
            width: '300px',
        },
        {
            displayProperty: 'capital',
            width: '300px',
        },
    ];
}

function getHeader(): IHeaderCell[] {
    return [
        {
            caption: '#',
            startColumn: 1,
            endColumn: 2,
        },
        {
            caption: 'Страна',
            startColumn: 2,
            endColumn: 3,
        },
        {
            caption: 'Столица',
            startColumn: 3,
            endColumn: 4,
        },
    ];
}

const { getData } = Countries;

/**
 * Демка для автотеста https://online.sbis.ru/doc/a2862d8a-46fd-4949-990d-c4340f09aba8
 */
class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: ManualResponseMemory;
    protected _header: IHeaderCell[] = getHeaderWithColumnScroll();
    protected _columns: IColumn[] = getColumnsWithScroll();
    protected _selectedKeys: number[] = [];
    protected _columnScroll: boolean = true;

    protected _reloadList(): void {
        this._children.list.reload();
    }

    protected _switchColumnScroll(): void {
        this._columnScroll = !this._columnScroll;

        if (this._columnScroll) {
            this._columns = getColumnsWithScroll();
            this._header = getHeaderWithColumnScroll();
        } else {
            this._columns = getColumns();
            this._header = getHeader();
        }
    }

    protected _continueScenario(event: SyntheticEvent): void {
        const source = this._options._dataOptionsValue.listData.source;
        source.callDeferredResponse();
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ManualResponseMemory({
                        keyProperty: 'key',
                        deferResponse: true,
                        data: getData(),
                    }),
                },
            },
        };
    },
});
