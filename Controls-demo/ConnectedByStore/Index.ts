import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/ConnectedByStore/Index';
import { HierarchicalMemory } from 'Types/source';
import { getFlatList } from 'Controls-demo/ConnectedByBrowser/Data';
import * as filter from 'Controls-demo/ConnectedByBrowser/DataFilter';
import 'css!Controls-demo/ConnectedByBrowser/Index';

const COUNT_ITEMS = 5;

const filterDescription = [
    {
        name: 'inStock',
        value: null,
        resetValue: null,
        textValue: '',
        viewMode: 'extended',
        editorTemplateName: 'Controls/filterPanel:BooleanEditor',
        editorOptions: {
            filterValue: true,
            extendedCaption: 'В наличии',
        },
    },
];

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): unknown {
        return {
            nomenclature: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: getFlatList(
                            ['США', 'Южная Корея', 'Тайвань'],
                            COUNT_ITEMS
                        ),
                        parentProperty: 'parent',
                        filter,
                    }),
                    searchParam: 'title',
                    displayProperty: 'title',
                    multiSelectVisibility: 'onhover',
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    filterDescription,
                },
            },
        };
    }
}
