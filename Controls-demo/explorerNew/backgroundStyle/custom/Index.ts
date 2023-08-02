import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/backgroundStyle/custom/backgroundStyleCustom';
import { Gadgets } from '../../DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getHeaderListData() {
    return [
        {
            id: 1,
            parent: null,
            'parent@': true,
            code: null,
            price: null,
            title: 'Комплектующие',
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Gadgets.getSearchColumns();
    protected _header: IHeaderCell[] = [
        {
            title: '',
        },
        {
            title: 'Код',
        },
        {
            title: 'Цена',
        },
    ];

    static _styles: string[] = [
        'Controls-demo/explorerNew/backgroundStyle/custom/backgroundStyleCustom',
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: Gadgets.getSearchData(),
                    }),
                    root: 1,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    markerVisibility: 'hidden',
                },
            },
            viewSearchListData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: Gadgets.getSearchDataLongFolderName(),
                    }),
                    filter: {
                        demo: 123,
                        title: 'Жесткий диск Seagate Original SATA-III 1Tb ST1000NC001 Constellation СS (7200rpm) 64Mb 3.5',
                    },
                    root: null,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    markerVisibility: 'hidden',
                    viewMode: 'search',
                    searchParam: 'title',
                    minSearchLength: 3,
                    searchStartingWith: 'root',
                },
            },
            headerListData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getHeaderListData(),
                    }),
                    root: null,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    markedKey: 1,
                },
            },
        };
    }
}
