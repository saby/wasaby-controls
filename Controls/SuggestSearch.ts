/**
 * @kaizen_zone 772ff1d9-b53b-4f9c-86eb-a788c4cdfc36
 */
import { Control } from 'UI/Base';
import * as template from 'wml!Controls/SuggestSearch';
import { descriptor } from 'Types/entity';
import { constants } from 'Env/Env';
import { Input } from 'Controls/search';
import { SyntheticEvent } from 'Vdom/Vdom';
import 'Controls/search';

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
        if (!this._markedKeyChanged || nativeEvent.which !== constants.key.enter) {
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

    select(): void {
        this._children.searchInput.select();
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

export default Suggest;
