/**
 * @kaizen_zone 51901a13-bec5-4da2-8548-f6477dc9eaf6
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_searchDeprecated/Input/Container';
import { SyntheticEvent } from 'UI/Vdom';
import { constants } from 'Env/Env';

export interface ISearchInputContainerOptions extends IControlOptions {
    searchDelay?: number | null;
    minSearchLength?: number;
    inputSearchValue?: string;
    searchValueTrim?: boolean;
}

/**
 * Контрол-контейнер для полей ввода, реализует функционал проверки количества введённых символов,
 * а также задержку между вводом символа в строку и выполнением поискового запроса.
 * @remark
 * Контрол принимает решение по событию valueChanged, должно ли сработать событие search или нет,
 * в зависимости от заданных параметров поиска - минимальной длины для начала поиска и времени задержки.
 *
 * Использование c контролом {@link Controls/browser:Browser} можно посмотреть в демо {@link /materials/DemoStand/app/Controls-demo%2FSearch%2FFlatList%2FIndex Controls-demo/Search/FlatList}
 *
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.searchDeprecated:InputContainer on:search="_search()" on:searchReset="_searchReset()">
 *    <Controls.search:Input/>
 * </Controls.searchDeprecated:InputContainer>
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * class ExampleControl extends Control {
 *     ...
 *     protected _search(event: SyntheticEvent, value: string) {
 *         // Выполняем поиск
 *     }
 *     protected _searchReset(event: SyntheticEvent) {
 *         // Сбрасываем поиск
 *     }
 *     ...
 * }
 * </pre>
 * @extends UI/Base:Control
 * @implements Controls/interface:IStoreId
 * @demo Controls-demo/Search/Explorer/Index
 * @demo Controls-demo/Search/FlatList/Index
 * @demo Controls-demo/Search/TreeView/Index
 * @public
 */
export default class Container extends Control<ISearchInputContainerOptions> {
    protected _template: TemplateFunction = template;

    protected _value: string;

    protected _beforeMount(options?: ISearchInputContainerOptions): void {
        this._value = '';
        if (options.inputSearchValue) {
            this._updateSearchData(options.inputSearchValue);
        }
    }

    protected _beforeUpdate(newOptions: ISearchInputContainerOptions): void {
        if (this._options.inputSearchValue !== newOptions.inputSearchValue) {
            this._updateSearchData(newOptions.inputSearchValue);
        }
    }

    private _updateSearchData(inputSearchValue: string): void {
        if (this._value !== inputSearchValue) {
            this._value = inputSearchValue;
        }
    }

    protected _search() {
        this._notify('search', [this._value], { bubbling: true });
    }

    protected _searchReset() {
        this._notify('searchReset', [''], { bubbling: true });
    }

    protected _valueChanged(event: SyntheticEvent, value: string): void {
        if (this._value !== value) {
            this._value = value;
            this._notify('inputSearchValueChanged', [value], {
                bubbling: true,
            });
        }
    }

    protected _keyDown(event: SyntheticEvent<KeyboardEvent>): void {
        if (event.nativeEvent.which === constants.key.enter) {
            event.stopPropagation();
        }
    }

    static getDefaultOptions(): ISearchInputContainerOptions {
        return {
            minSearchLength: 3,
            searchDelay: 500,
        };
    }
}

/**
 * @name Controls/_searchDeprecated/Input/Container#searchDelay
 * @cfg {number|null} Время задержки перед поиском.
 * @default 500
 * @remark
 * Значение задается в мс.
 * @demo Controls-demo/Search/Explorer/Index
 * @demo Controls-demo/Search/FlatList/Index
 * @demo Controls-demo/Search/TreeView/Index
 */

/**
 * @name Controls/_searchDeprecated/Input/Container#minSearchLength
 * @cfg {number} Минимальная длина значения для начала поиска.
 * @default 3
 * @demo Controls-demo/Search/Explorer/Index
 * @demo Controls-demo/Search/FlatList/Index
 * @demo Controls-demo/Search/TreeView/Index
 */

/**
 * @name Controls/_searchDeprecated/Input/Container#inputSearchValue
 * @cfg {string} Значение строки ввода
 * @demo Controls-demo/Search/Explorer/Index
 * @demo Controls-demo/Search/FlatList/Index
 * @demo Controls-demo/Search/TreeView/Index
 */

/**
 * @event search Происходит при начале поиска.
 * @name Controls/_searchDeprecated/Input/Container#search
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {value} string Значение по которому производится поиск.
 */

/**
 * @event searchReset Происходит при сбросе поиска.
 * @name Controls/_searchDeprecated/Input/Container#searchReset
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */
