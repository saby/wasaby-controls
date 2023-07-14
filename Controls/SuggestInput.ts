/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import { Control } from 'UI/Base';
import template = require('wml!Controls/_SuggestInput/Input');
import { EventUtils } from 'UI/Events';
import { descriptor } from 'Types/entity';
import { generateStates, Text } from 'Controls/input';
import 'css!Controls/SuggestInput';

/**
 * Поле ввода с автодополнением это однострочное поле ввода, которое помогает пользователю ввести текст, предлагая подходящие варианты по первым набранным символам.
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FSuggest%2FSuggest демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_suggest.less переменные тем оформления}
 *
 * @class Controls/SuggestInput
 * @extends UI/Base:Control
 * @mixes Controls/suggest:ISuggest
 * @implements Controls/interface:ISearch
 * @implements Controls/interface/IBorderStyle
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/interface:IContrastBackground
 * @implements Controls/interface:ISelectorDialog
 * @mixes Controls/input:ITag
 * @mixes Controls/input:IBase
 * @implements Controls/interface:IInputPlaceholder
 * @mixes Controls/input:IText
 * @mixes Controls/input:IValue
 * @mixes Controls/input:IFieldTemplate
 *
 * @public
 * @demo Controls-demo/Suggest_new/Input/DisplayProperty/DisplayProperty
 */

/*
 * The Input/Suggest control is a normal text input enhanced by a panel of suggested options.
 *
 * Here you can see the <a href="/materials/DemoStand/app/Controls-demo%2FSuggest%2FSuggest">demo examples</a>.
 *
 * @class Controls/SuggestInput
 * @extends UI/Base:Control
 * @mixes Controls/suggest:ISuggest
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:INavigation
 * @mixes Controls/input:IBase
 * @mixes Controls/input:IText
 *
 * @public
 * @demo Controls-demo/Suggest_new/Input/DisplayProperty/DisplayProperty
 * @author Gerasimov A.M.
 */
const Suggest = Control.extend({
    _template: template,
    _notifyHandler: EventUtils.tmplNotify,
    _suggestState: false,
    _searchState: false,
    _suggestDirection: null,
    _children: {
        input: Text,
    },

    // <editor-fold desc="LifeCycle">

    _beforeMount(options) {
        this._searchStart = this._searchStart.bind(this);
        this._searchEnd = this._searchEnd.bind(this);
        this._searchError = this._searchError.bind(this);
        generateStates(this, options);
    },

    // </editor-fold>

    openSuggest() {
        this._suggestState = true;
    },

    closeSuggest() {
        this._suggestState = false;
    },

    // <editor-fold desc="handlers">

    _changeValueHandler(event, value) {
        this._notify('valueChanged', [value]);
    },

    _choose(event, item) {
        /* move focus to input after select, because focus will be lost after closing popup  */
        this.activate({ enableScreenKeyboard: true });
        this._notify('valueChanged', [item.get(this._options.displayProperty || '')]);
    },

    _clearMousedown(event) {
        event.stopPropagation();
    },

    _clearClick() {
        /* move focus to input after clear text, because focus will be lost after hiding cross  */
        this.activate({ enableScreenKeyboard: true });
        this._suggestState = this._options.autoDropDown;
        this._notify('valueChanged', ['']);
    },

    _deactivated() {
        this._suggestState = false;
    },

    _searchStart() {
        this._searchState = true;
        // eslint-disable-next-line
        this._forceUpdate();
    },

    _searchEnd() {
        this._searchState = false;
        // eslint-disable-next-line
        this._forceUpdate();
    },

    _searchError() {
        this._searchState = false;
    },

    _suggestDirectionChanged(event, direction): void {
        this._suggestDirection = direction;
    },

    paste(value: string): void {
        this._children.input.paste(value);
    },

    select(): void {
        this._children.input.select();
    },
    // </editor-fold>
});

// <editor-fold desc="OptionsDesc">

Suggest.getOptionTypes = () => {
    return {
        displayProperty: descriptor(String).required(),
        searchParam: descriptor(String).required(),
    };
};
Suggest.getDefaultOptions = () => {
    return {
        minSearchLength: 3,
    };
};

// </editor-fold>
/**
 * @event showSelector Происходит перед открытием окна выбора, которое открывается при клике на "Показать всё".
 * @remark
 * Кнопка "Показать всё" отображается в подвале автодополнения.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/**
 * @name Controls/SuggestInput#fontSize
 * @cfg {String}
 * @demo Controls-demo/Suggest_new/Input/FontSize/Index
 */

/**
 * @name Controls/SuggestInput#closeButtonVisible
 * @cfg {Boolean} Флаг, отвечающий за отображение кнопки закрытия автодополнения.
 */

/**
 * @name Controls/SuggestInput#closeSuggest
 * @function
 * @description Закрывает окно автодополнения.
 */

/**
 * @name Controls/SuggestInput#openSuggest
 * @function
 * @description Открывает окно автодополнения.
 */

export default Suggest;
