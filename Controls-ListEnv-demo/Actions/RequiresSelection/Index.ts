import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Actions/RequiresSelection/Index';
import { IColumn, IHeaderCell } from 'Controls/grid';
import 'Controls-ListEnv/actions';
import { IFilterItem } from 'Controls/filter';
import { getFlatList, getFilterDescription, getEditorsViewMode } from './Data';
import { HierarchicalMemory } from 'Types/source';
import * as filter from './DataFilter';
import { IContextValue } from 'Controls/context';
import { connectToDataContext } from 'Controls/contextDeprecated';
import 'css!Controls-ListEnv-demo/Filter/filter';

interface IOptions extends IControlOptions {
    _dataOptionsValue: IContextValue;
}
const COUNT_ITEMS = 5;

class LayoutWithFilter extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _toggleSelectedKey: string = 'notSelected';
    protected _editorsViewMode: string;
    protected _multiSelect: boolean = true;
    protected _slice: any;
    protected _nomenclatureHeader: IHeaderCell[] = [
        { caption: 'Название' },
        { caption: 'Страна' },
        { caption: 'Тип' },
        { caption: 'Тип экрана' },
        { caption: 'Производитель' },
        { caption: 'Наличие' },
    ];
    protected _columns: IColumn[] = [
        { displayProperty: 'title', width: '150px' },
        { displayProperty: 'country' },
        { displayProperty: 'type' },
        { displayProperty: 'screenType' },
        { displayProperty: 'company' },
        { displayProperty: 'available' },
    ];

    protected _beforeMount(options: IOptions): void {
        this._slice = options._dataOptionsValue.nomenclature;
        this._editorsViewMode = getEditorsViewMode();
        this._toggleSelectedKey = this._editorsViewMode || 'notSelected';
    }
}

const connectedDemo = connectToDataContext(LayoutWithFilter);

connectedDemo.getLoadConfig = (): Record<string, unknown> => {
    const editorsViewMode = getEditorsViewMode();
    return {
        nomenclature: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new HierarchicalMemory({
                    keyProperty: 'id',
                    data: getFlatList(['США', 'Южная Корея', 'Тайвань'], COUNT_ITEMS),
                    parentProperty: 'parent',
                    filter,
                }),
                listActions: 'Controls-ListEnv-demo/Actions/RequiresSelection/listActions',
                searchParam: 'title',
                displayProperty: 'title',
                multiSelectVisibility: 'onhover',
                keyProperty: 'id',
                viewMode: 'table',
                parentProperty: 'parent',
                nodeProperty: 'node',
                editorsViewMode,
                filterDescription: getFilterDescription() as IFilterItem[],
            },
        },
    };
};
export default connectedDemo;
