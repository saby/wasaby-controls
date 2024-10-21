/**
 * @kaizen_zone 772ff1d9-b53b-4f9c-86eb-a788c4cdfc36
 */
import { Control } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_SuggestSearch/Suggest';
import { descriptor } from 'Types/entity';
import { constants } from 'Env/Env';
import { Input } from 'Controls/search';
import { SyntheticEvent } from 'Vdom/Vdom';
import 'Controls/search';
import 'css!Controls-ListEnv/SuggestSearch';

/**
 * Строка поиска с автодополнением, позволяет пользователю вводить однострочный текст.
 * Для связи поиска со списком используйте контрол {@link Controls-ListEnv/ExtSearchConnected}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/extsearch/ руководство разработчика по настройке контрола}
 *
 * @class Controls-ListEnv/SuggestSearch
 * @extends Controls/_input/Text
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:ISelectorDialog
 * @implements Controls/search:Input
 * @mixes Controls/suggest:ISuggest
 * @implements Controls/interface:INavigation
 * @mixes Controls/input:IFieldTemplate
 * @demo Controls-ListEnv-demo/SuggestSearch/AutoDropDown/AutoDropDown
 * @public
 */

/*
 * Search input that suggests options as you are typing.
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/'>here</a>.
 *
 * @class Controls-ListEnv/SuggestSearch
 * @extends Controls/_input/Text
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @mixes Controls/suggest:ISuggest
 * @implements Controls/interface:INavigation
 * @demo Controls-ListEnv-demo/SuggestSearch/AutoDropDown/AutoDropDown
 * @public
 */

const Suggest = Control.extend({
    _template: template,
    _suggestState: false,
    _markedKeyChanged: false,
    _children: {
        searchInput: Input,
    },

    _changeValueHandler(event, value) {
        this._notify('valueChanged', [value]);
    },

    _choose(event, item, tabSelectedKey) {
        event.stopPropagation();
        if (this._notify('choose', [item, tabSelectedKey]) !== false) {
            this.activate();
            this._notify('valueChanged', [item.get(this._options.displayProperty) || '']);
        }
    },

    _close() {
        /* need clear text on close button click
         * (by standart http://axure.tensor.ru/standarts/v7/строка_поиска__версия_01_.html).
         * Notify event only if value is not empty, because event listeners expect, that the value is really changed
         * */
        if (this._options.value) {
            this._notify('valueChanged', ['']);
        }
    },

    _beforeMount(options) {
        this._popupOffsetCallback = this._popupOffsetCallback.bind(this);
    },

    _popupOffsetCallback(newOffset) {
        this._searchInputOffsetLeft = newOffset.left;
    },

    _beforeUpdate(newOptions) {
        if (this._options.suggestState !== newOptions.suggestState) {
            this._suggestState = newOptions.suggestState;
        }
    },

    _suggestStateChanged(event, value) {
        this._notify('suggestStateChanged', [value]);
    },

    _deactivated() {
        this._suggestState = false;
        this._notify('suggestStateChanged', [false]);
    },

    _suggestMarkedKeyChanged(event, key: string | null) {
        this._markedKeyChanged = key !== null;
    },

    _searchButtonClick(event: SyntheticEvent): void {
        this.search(event);
    },

    searchClick(event: SyntheticEvent, nativeEvent: Event) {
        const byEnterClick = nativeEvent.which === constants.key.enter;

        // маркер стоит на записи автодополнения, поиск запускаться не должен, должна выбраться запись из автодополнения
        if (byEnterClick && this._markedKeyChanged) {
            return false;
        }

        if (!this._markedKeyChanged || byEnterClick) {
            const eventResult = this._notify('searchClick', [event, nativeEvent]);

            if (eventResult !== false && this._options.value) {
                this._suggestState = false;
                this._notify('suggestStateChanged', [false]);
                this._children.suggestController.closeSuggest();
            } else if (!this._suggestState && this._options.autoDropDown) {
                this._suggestState = true;
                this._notify('suggestStateChanged', [true]);
            }
        }
    },

    _resetClick() {
        if (!this._options.autoDropDown) {
            this._suggestState = false;
        }
        this._notify('resetClick');
    },

    openSuggest(): void {
        this._notify('suggestStateChanged', [true]);
        this._suggestState = true;
    },

    closeSuggest(): void {
        this._suggestState = false;
    },

    paste(value: string): void {
        this._children.searchInput.paste(value);
    },

    select(): void {
        this._children.searchInput.select();
    },

    reset(): void {
        this._children.searchInput.reset();
    },

    search(event?: SyntheticEvent): void {
        this._children.searchInput.search(event);
    },

    _suggestOpen(): void {
        this._notify('suggestOpen');
    },

    _suggestClose(): void {
        this._searchInputOffsetLeft = 0;
        this._notify('suggestClose');
    },

    _search(event: SyntheticEvent, value: string) {
        this._notify('search', [value]);
    },

    _searchReset() {
        this._notify('searchReset', ['']);
    },
});

Suggest.getOptionTypes = () => {
    return {
        displayProperty: descriptor(String).required(),
        searchParam: descriptor(String).required(),
    };
};
Suggest.getDefaultOptions = () => {
    return {
        // Для строки поиска
        minSearchLength: 3,
        // Для саггеста
        suggestMinSearchLength: 3,
        suggestState: false,
        searchButtonVisible: true,
    };
};

/**
 * @name Controls-ListEnv/SuggestSearch#searchButtonVisible
 * @cfg {Boolean} Определяет, показывать ли иконку поиска.
 */

/**
 * @name Controls-ListEnv/SuggestSearch#inputClassName
 * @cfg {String} Класс для строки поиска.
 */

/**
 * @name Controls-ListEnv/SuggestSearch#closeSuggest
 * @function
 * @description Закрывает окно автодополнения.
 */

/**
 * @name Controls-ListEnv/SuggestSearch#openSuggest
 * @function
 * @description Открывает окно автодополнения.
 */

/**
 * @name Controls-ListEnv/SuggestSearch#closeButtonVisible
 * @cfg {Boolean} Флаг, отвечающий за отображение кнопки закрытия автодополнения.
 */

/**
 * @name Controls-ListEnv/SuggestSearch#suggestMinSearchLength
 * @cfg {Number} Минимальное количество символов, которое пользователь должен ввести для поиска в автодополнении.
 * @see minSearchLength
 * @default 3
 */

/*
 * @name Controls-ListEnv/SuggestSearch#searchButtonVisible
 * @cfg {Boolean} Determines whether to show the search icon.
 */
export default Suggest;
