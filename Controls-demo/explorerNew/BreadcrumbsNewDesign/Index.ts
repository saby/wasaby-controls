import { IColumn } from 'Controls/grid';
import { RecordSet } from 'Types/collection';
import { HierarchicalMemory } from 'Types/source';
import { Control, TemplateFunction } from 'UI/Base';
import { Gadgets } from '../DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/explorerNew/BreadcrumbsNewDesign/Index';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    const data = [...Gadgets.getData()];
    data.unshift({
        id: 999,
        parent: null,
        'parent@': true,
        title: 'Очень длинное название папки на первом уровне что бы проверить не обрезается ли кнопка вызова навигационного меню при небольшой ширине экрана',
        discr: '5',
        price: 123,
    });
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    // Отдельный источник для PathButton как пример возможности
    protected _pathButtonSource: HierarchicalMemory;

    protected _columns: IColumn[] = Gadgets.getColumns();

    protected _backButtonFontSize: string = '3xl';
    protected _fontSizes: RecordSet = new RecordSet({
        keyProperty: 'id',
        rawData: [
            {
                id: 's',
                title: 's',
            },
            {
                id: 'm',
                title: 'm',
            },
            {
                id: 'l',
                title: 'l',
            },
            {
                id: 'xl',
                title: 'xl',
            },
            {
                id: '2xl',
                title: '2xl',
            },
            {
                id: '3xl',
                title: '3xl',
            },
            {
                id: '4xl',
                title: '4xl',
            },
            {
                id: '5xl',
                title: '5xl',
            },
            {
                id: '6xl',
                title: '6xl',
            },
            {
                id: '7xl',
                title: '7xl',
            },
        ],
    });

    protected _beforeMount(): void {
        this._pathButtonSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: getData(),
            filter: (item, query): boolean => {
                if (query['Только узлы']) {
                    return item.get('parent@') !== null;
                }
                return true;
            },
        });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            BreadcrumbsNewDesign: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    root: 121,
                    viewMode: 'table',
                    keyProperty: 'id',
                    nodeProperty: 'parent@',
                    parentProperty: 'parent',
                },
            },
        };
    }
}
