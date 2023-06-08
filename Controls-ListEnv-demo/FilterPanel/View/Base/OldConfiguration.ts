import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Base/OldConfiguration';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory = null;
    protected _filterDescription: IFilterItem[] = null;

    protected _beforeMount(): void | Promise<void> {
        this._viewSource = new Memory({
            data: departments,
            keyProperty: 'department',
            filter: (item, queryFilter) => {
                let addToData = true;
                for (const filterField in queryFilter) {
                    if (queryFilter.hasOwnProperty(filterField) && item.get(filterField)) {
                        const filterValue = queryFilter[filterField];
                        const itemValue = item.get(filterField);
                        addToData = filterValue?.includes(itemValue) || !filterValue?.length;
                    }
                }
                return addToData;
            },
        });
        this._filterDescription = [
            {
                caption: 'Отдел',
                name: 'department',
                resetValue: null,
                value: null,
                textValue: '',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                editorOptions: {
                    keyProperty: 'department',
                    displayProperty: 'title',
                    source: new Memory({
                        data: departments,
                        keyProperty: 'department',
                    }),
                },
            },
        ];
    }
}
