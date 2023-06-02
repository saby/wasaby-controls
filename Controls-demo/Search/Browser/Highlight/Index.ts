import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/Search/Browser/Highlight/Index';
import { Memory } from 'Types/source';
import * as memorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';

export default class FlatList extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
                { id: 1, title: 'Разработка' },
                { id: 2, title: 'Продвижение СБИС' },
                { id: 3, title: 'Федеральная клиентская служка' },
            ],
            keyProperty: 'id',
            filter: memorySourceFilter('title'),
        });
    }
}
