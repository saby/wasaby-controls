/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_SuggestInput/Input');
import { EventUtils } from 'UI/Events';
import { descriptor } from 'Types/entity';
import {
    generateStates,
    getDefaultBorderVisibilityOptions,
    IBase,
    IFieldTemplate,
    ITag,
    IText,
    IValue,
    Text,
    IMaxLengthOptions,
} from 'Controls/input';
import 'css!Controls/SuggestInput';
import {
    IBorderStyle,
    IContrastBackground,
    IFilter,
    IFilterChanged,
    IFontColorStyle,
    IFontSize,
    IFontWeight,
    IHeight,
    IInputPlaceholder,
    INavigation,
    ISearch,
    ISelectorDialog,
    ISource,
    ISuggest,
    IValidationStatus,
} from 'Controls/interface';

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

/**
 * Интерфейс для поля ввода с автодополнением
 * @interface Controls/SuggestInput/ISuggestOptions
 * @extends Controls/suggest:ISuggest
 * @extends Controls/interface:ISearch
 * @extends Controls/interface/IBorderStyle
 * @extends Controls/interface:ISource
 * @extends Controls/interface:IFilterChanged
 * @extends Controls/interface:INavigation
 * @extends Controls/interface:IFontColorStyle
 * @extends Controls/interface:IFontSize
 * @extends Controls/interface:IFontWeight
 * @extends Controls/interface:IHeight
 * @extends Controls/interface:IValidationStatus
 * @extends Controls/interface:IContrastBackground
 * @extends Controls/interface:ISelectorDialog
 * @extends Controls/interface:IFilter
 * @extends Controls/input:ITag
 * @extends Controls/input:IBase
 * @extends Controls/interface:IInputPlaceholder
 * @extends Controls/input:IText
 * @extends Controls/input:IValue
 * @extends Controls/input:IFieldTemplate
 * @extends Controls/input:IMaxLengthOptions
 * @public
 */
export interface ISuggestOptions
    extends ISuggest,
        ISearch,
        IBorderStyle,
        ISource,
        IFilterChanged,
        INavigation,
        IFontColorStyle,
        IFontSize,
        IFontWeight,
        IHeight,
        IValidationStatus,
        IContrastBackground,
        ISelectorDialog,
        ITag,
        IBase,
        IInputPlaceholder,
        IText,
        IValue,
        IFieldTemplate,
        IFilter,
        IMaxLengthOptions {
    closeButtonVisible?: boolean;
}

/**
 * Поле ввода с автодополнением это однострочное поле ввода, которое помогает пользователю ввести текст, предлагая подходящие варианты по первым набранным символам.
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_suggest.less переменные тем оформления}
 * * {@link Controls/SuggestInput:ISuggestOptions интерфейс для создания прикладных оберток над полем ввода с автодополнением}
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
class Suggest extends Control<ISuggestOptions> {
    _template: TemplateFunction = template;
    _notifyHandler: Function = EventUtils.tmplNotify;
    _suggestState: boolean = false;
    _searchState: boolean = false;
    _suggestDirection: string = null;
    _children: {
        input: Text;
    };

    // <editor-fold desc="LifeCycle">

    _beforeMount(options: ISuggestOptions): void {
        this._searchStart = this._searchStart.bind(this);
        this._searchEnd = this._searchEnd.bind(this);
        this._searchError = this._searchError.bind(this);
        generateStates(this, options);
    }

    // </editor-fold>

    openSuggest(): void {
        this._suggestState = true;
    }

    closeSuggest(): void {
        this._suggestState = false;
    }

    // <editor-fold desc="handlers">

    _changeValueHandler(event, value): void {
        this._notify('valueChanged', [value]);
    }

    _choose(event, item): void {
        /* move focus to input after select, because focus will be lost after closing popup  */
        this.activate({ enableScreenKeyboard: true });
        this._notify('valueChanged', [item.get(this._options.displayProperty || '')]);
    }

    _clearMousedown(event): void {
        event.stopPropagation();
    }

    _clearClick(): void {
        /* move focus to input after clear text, because focus will be lost after hiding cross  */
        this.activate({ enableScreenKeyboard: true });
        this._suggestState = this._options.autoDropDown;
        this._notify('valueChanged', ['']);
    }

    _deactivated(): void {
        this._suggestState = false;
    }

    _searchStart(): void {
        this._searchState = true;
        // eslint-disable-next-line
        this._forceUpdate();
    }

    _searchEnd(): void {
        this._searchState = false;
        // eslint-disable-next-line
        this._forceUpdate();
    }

    _searchError(): void {
        this._searchState = false;
    }

    _suggestDirectionChanged(event, direction): void {
        this._suggestDirection = direction;
    }

    paste(value: string): void {
        this._children.input.paste(value);
    }

    select(): void {
        this._children.input.select();
    }
    // </editor-fold>
}

// <editor-fold desc="OptionsDesc">

Suggest.getOptionTypes = () => {
    return {
        displayProperty: descriptor(String).required(),
        searchParam: descriptor(String).required(),
    };
};
Suggest.getDefaultOptions = () => {
    return {
        ...getDefaultBorderVisibilityOptions(),
        minSearchLength: 3,
        selectionType: 'leaf',
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
