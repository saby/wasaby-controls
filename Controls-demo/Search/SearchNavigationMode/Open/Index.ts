import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Search/SearchNavigationMode/Open/Index';
import * as MemorySource from 'Controls-demo/Explorer/ExplorerMemory';
import { IColumn } from 'Controls/grid';

export default class Explorer extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: MemorySource;
    protected _root: string = null;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
            width: '1fr',
        },
    ];
    protected _expandedItems: null;

    protected _beforeMount(): void {
        this._viewSource = new MemorySource({
            keyProperty: 'id',
            data: [
                {
                    id: 1,
                    parent: null,
                    'parent@': true,
                    title: 'Документы',
                },
                {
                    id: 11,
                    parent: 1,
                    'parent@': true,
                    title: 'Задачи',
                },
                {
                    id: 111,
                    parent: 11,
                    'parent@': false,
                    title: 'Ошибка',
                },
                {
                    id: 112,
                    parent: 11,
                    'parent@': false,
                    title: 'Задача',
                },
                {
                    id: 2,
                    parent: null,
                    'parent@': true,
                    title: 'Руководители',
                },
                {
                    id: 21,
                    parent: 2,
                    'parent@': false,
                    title: 'Новиков Д.В.',
                },
            ],
        });
    }
}
