/**
 * @kaizen_zone 772ff1d9-b53b-4f9c-86eb-a788c4cdfc36
 */
import { Control } from 'UI/Base';
import * as template from 'wml!Controls/_SuggestSearch/Suggest';
import { descriptor } from 'Types/entity';
import { constants } from 'Env/Env';
import { Input } from 'Controls/search';
import { SyntheticEvent } from 'Vdom/Vdom';
import 'Controls/search';

/**
 * Строка поиска с автодополнением, позволяет пользователю вводить однострочный текст.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_suggest.less переменные тем оформления}
 * * {@link http://axure.tensor.ru/StandardsV8/автодополнение.html Спецификация Axure}
 *
 * @class Controls/SuggestSearch
 * @extends Controls/_input/Text
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:ISelectorDialog
 * @mixes Controls/suggest:ISuggest
 * @implements Controls/interface:INavigation
 * @mixes Controls/input:IFieldTemplate
 * @demo Controls-demo/Suggest_new/SearchInput/AutoDropDown/AutoDropDown
 * @public
 */

/*
 * Search input that suggests options as you are typing.
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/'>here</a>.
 *
 * @class Controls/SuggestSearch
 * @extends Controls/_input/Text
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @mixes Controls/suggest:ISuggest
 * @implements Controls/interface:INavigation
 * @demo Controls-demo/Suggest_new/SearchInput/AutoDropDown/AutoDropDown
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

    _choose(event, item) {
        this.activate();
        this._notify('valueChanged', [
            item.get(this._options.displayProperty) || '',
        ]);
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

    searchClick(event: SyntheticEvent, nativeEvent: Event) {
        if (
            !this._markedKeyChanged ||
            nativeEvent.which !== constants.key.enter
        ) {
            const eventResult = this._notify('searchClick');

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

    _suggestOpen(): void {
        this._notify('suggestOpen');
    },

    _suggestClose(): void {
        this._notify('suggestClose');
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
        minSearchLength: 3,
        suggestState: false,
    };
};

/**
 * @name Controls/SuggestSearch#searchButtonVisible
 * @cfg {Boolean} Определяет, показывать ли иконку поиска.
 */

/**
 * @name Controls/SuggestSearch#inputClassName
 * @cfg {String} Класс для строки поиска.
 */

/**
 * @name Controls/SuggestSearch#closeSuggest
 * @function
 * @description Закрывает окно автодополнения.
 */

/**
 * @name Controls/SuggestSearch#openSuggest
 * @function
 * @description Открывает окно автодополнения.
 */

/**
 * @name Controls/SuggestSearch#closeButtonVisible
 * @cfg {Boolean} Флаг, отвечающий за отображение кнопки закрытия автодополнения.
 */

/*
 * @name Controls/SuggestSearch#searchButtonVisible
 * @cfg {Boolean} Determines whether to show the search icon.
 */
export default Suggest;
