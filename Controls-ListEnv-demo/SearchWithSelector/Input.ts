import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/SearchWithSelector/Input';
import * as ContentTemplate from 'wml!Controls-ListEnv-demo/SearchWithSelector/resources/Content';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'UICommon/Events';
import 'css!Controls-ListEnv-demo/ExtSearch/Input';

interface IFilter {
    isProvider: boolean;
}

const data = [
    { id: 1, title: 'Ромашка', isProvider: true },
    { id: 2, title: 'Сбербанк', isProvider: true },
    { id: 3, title: 'Альфа', isProvider: true },
    { id: 1, title: 'МТС', isProvider: false },
    { id: 2, title: 'Энергпромсьбыт', isProvider: false },
];

class ActionDemo extends Control<IControlOptions, void> {
    _template: TemplateFunction = template;
    protected _menuSource: Memory;
    protected _source: Memory;
    protected _value: string = '';
    protected _placeholder: string = 'Введите название компании или ИНН';
    protected _selectedKeys: number[] = [1];
    protected _filter: IFilter = {
        isProvider: true,
    };
    protected _menuContentTemplate: TemplateFunction = ContentTemplate;

    _beforeMount(): void {
        this._updateSource();
        this._menuSource = new Memory({
            keyProperty: 'id',
            data: [
                { id: 1, title: 'Поставщики' },
                { id: 2, title: 'Торги' },
            ],
        });
    }

    protected _updateSource(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data,
            filter: (item, queryFilter: Record<string, string>) => {
                let addToData = true;
                const filterValue = queryFilter.title.toLowerCase();
                const itemValue = item.get('title').toLowerCase();
                const isProvider = item.get('isProvider');
                addToData =
                    (itemValue.includes(filterValue) || !filterValue?.length) &&
                    isProvider === this._filter.isProvider;
                return addToData;
            },
        });
    }

    protected _onMousedown(event: SyntheticEvent): void {
        event.stopPropagation();
    }

    protected _handleSelectedKeysChanged(event: SyntheticEvent, keys: number[]): void {
        const selectedKey = keys[0];
        this._filter.isProvider = selectedKey === 1;
        this._placeholder = this._getPlaceholder(selectedKey);
        this._updateSource();
    }

    protected _getPlaceholder(selectedKey: number): string {
        const title = this._menuSource.data.find((item) => {
            return item.id === selectedKey;
        }).title;
        return title === 'Поставщики'
            ? 'Введите название компании или ИНН'
            : 'Введите слово для поиска или номер торга';
    }
}
export default ActionDemo;
