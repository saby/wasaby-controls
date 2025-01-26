import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/InBrowser/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import {
    listData,
    namesFilterData,
    cityFilterData,
} from 'Controls-ListEnv-demo/Filter/resources/Data';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _listSource: Memory = null;
    protected _filterSource: IFilterItem[] = null;

    protected _beforeMount(): void | Promise<void> {
        this._listSource = new Memory({
            data: listData,
            keyProperty: 'id',
        });
        this._filterSource = [
            {
                name: 'name',
                caption: 'Имя',
                value: null,
                resetValue: null,
                viewMode: 'basic',
                textValue: '',
                editorOptions: {
                    source: new Memory({
                        data: namesFilterData,
                        keyProperty: 'name',
                    }),
                    keyProperty: 'name',
                    displayProperty: 'name',
                },
                editorTemplateName: 'Controls/filterPanel:ListEditor',
            },
            {
                name: 'city',
                caption: 'Город проживания',
                value: null,
                resetValue: null,
                viewMode: 'basic',
                textValue: '',
                editorOptions: {
                    source: new Memory({
                        data: cityFilterData,
                        keyProperty: 'city',
                    }),
                    keyProperty: 'city',
                    displayProperty: 'city',
                },
                editorTemplateName: 'Controls/filterPanel:ListEditor',
            },
        ] as IFilterItem[];
    }
}
