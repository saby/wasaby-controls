import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/SearchWithSelector/SuggestListsOptions/Input';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import 'css!Controls-ListEnv-demo/ExtSearch/Input';

class ActionDemo extends Control<IControlOptions, void> {
    _template: TemplateFunction = template;
    protected _suggestListsOptions: object;
    protected _value: string = '';

    _beforeMount(): void {
        this._suggestListsOptions = {
            1: {
                order: 1,
                caption: 'Контрагенты',
                id: '1',
                placeholder: 'Введите название контрагента',
                source: new SearchMemory({
                    keyProperty: 'id',
                    filter: MemorySourceFilter(),
                    searchParam: 'title',
                    data: [
                        { id: 1, title: 'Контрагент 1' },
                        { id: 2, title: 'Контрагент 2' },
                        { id: 3, title: 'Контрагент 3' },
                    ],
                }),
            },
            2: {
                order: 0,
                caption: 'Компании',
                id: '2',
                placeholder: 'Введите название компании',
                source: new SearchMemory({
                    keyProperty: 'id',
                    searchParam: 'title',
                    filter: MemorySourceFilter(),
                    data: [
                        { id: 1, title: 'Компания 1' },
                        { id: 2, title: 'Компания 2' },
                    ],
                }),
            },
        };
    }
}
export default ActionDemo;
