/**
 * @kaizen_zone 51901a13-bec5-4da2-8548-f6477dc9eaf6
 */
import rk = require('i18n!Controls');
import SearchButtonRightTemplate from 'Controls/_search/Input/SearchTemplate/rightTemplate';
import SearchButtonLeftTemplate from 'Controls/_search/Input/SearchTemplate/leftTemplate';
import {
    Base,
    generateStates,
    IBaseInputOptions,
    IBaseOptions,
    ITextOptions,
    TextViewModel as ViewModel,
} from 'Controls/input';
import { throttle } from 'Types/function';
import { descriptor } from 'Types/entity';
import { constants } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { TStoreImport } from 'Controls/interface';
import 'css!Controls/search';
import SearchResolver from 'Controls/_search/SearchResolver';

export interface ISearchIconOptions {
    searchButtonAlign?: 'left' | 'right';
    searchButtonIconStyle?: string;
    searchButtonVisible?: boolean;
    iconSize?: string;
}

export interface ISearchInputOptions
    extends IBaseOptions,
        IBaseInputOptions,
        ITextOptions,
        ISearchIconOptions {
    searchDelay?: number | null;
    minSearchLength?: number;
    resetButtonVisible?: boolean;
    value?: string;
    useStore?: boolean;
    searchValueTrim?: boolean;
    designContextValue?: object;

    onResetClick?: (event) => void;
    onSearchClickEvery?: (event, ...args) => void;
    onSearchClick?: (event, ...args) => void;
    onSearchReset?: (value) => void;
    onSearch?: (value) => void;
    searchClickThrottle?: boolean;
}

// timer for search, when user click on search button or pressed enter.
// protect against clickjacking (https://en.wikipedia.org/wiki/Clickjacking)
const SEARCH_BY_CLICK_THROTTLE = 300;

const _private = {
    isVisibleResetButton() {
        return !!this._viewModel.displayValue && !this._getReadOnly();
    },

    getIconSize(inlineHeight: string): string {
        if (['s', 'xs', 'm', 'default'].includes(inlineHeight)) {
            return 's';
        } else if (inlineHeight === 'l') {
            return 'm_trigger';
        } else if (['xl', '2xl', '3xl'].includes(inlineHeight)) {
            return 'm';
        }
    },
};

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

/**
 * Контрол "Строка поиска". Является однострочным полем ввода. Контрол используют в реестрах для ввода поискового запроса.
 * Функционал контрола идентичен полям ввода из библиотеки {@link Controls/input}, однако в отличие от них имеет собственное визуальное оформление.
 * @class Controls/_search/Input
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/component-kinds/ руководство разработчика по классификации контролов Wasaby и схеме их взаимодействия}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_search.less переменные тем оформления}
 *
 * @mixes Controls/search:Input
 * @mixes Controls/input:IFieldTemplate
 * @extends Controls/_input/Base
 *
 * @mixes Controls/input:IText
 * @implements Controls/interface:IContrastBackground
 *
 * @ignoreoptions style
 *
 *
 * @public
 * @demo Controls-demo/Search/Input/Base/Index
 *
 */

/*
 * Controls that allows user to enter single-line text.
 * These are functionally identical to text inputs, but may be styled differently.
 *
 * Information on searching settings in the list using the "input:Search" control you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2FSearch%2FContainer">Demo with Input/Search and List control</a>.
 * <a href="/materials/DemoStand/app/Controls-demo%2FFilterSearch%2FFilterSearch">Demo with Filter/Button, Input/Search and List control</a>.
 *
 * @mixes Controls/search:Input
 * @extends Controls/_input/Base
 *
 * @mixes Controls/input:IText
 * @implements Controls/interface:IContrastBackground
 *
 * @ignoreoptions style
 *
 *
 * @public
 * @demo Controls-demo/Search/Input/Base/Index
 *
 * @author Золотова Э.Е.
 */
class Search extends Base<ISearchInputOptions> {
    protected _wasActionUser: boolean = false;
    protected _resetCommandCallbackId: string = '';
    protected _storeCtxCallbackId: string = '';
    protected _controlName: string = 'search';
    protected _searchResolverController: SearchResolver = null;

    constructor(props: ISearchInputOptions) {
        super(props);
        if (props.value) {
            this._searchResolverController = this._initializeSearchResolverController(props);
            this._updateSearchData(props.value, props.minSearchLength, '');
        }
        this._notifySearchClick = throttle(
            this._notifySearchClick,
            props.searchClickThrottle ? SEARCH_BY_CLICK_THROTTLE : 0,
            false
        );
        generateStates(this, props);
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.useStore) {
            this._subscribeStoreCommands();
            this._storeCtxCallbackId = getStore().onPropertyChanged(
                '_contextName',
                () => {
                    getStore().unsubscribe(this._resetCommandCallbackId);
                    this._subscribeStoreCommands();
                },
                true
            );
        }
    }

    _subscribeStoreCommands(): void {
        this._resetCommandCallbackId = getStore().declareCommand(
            'resetSearch',
            this._resetSearchHandler.bind(this)
        );
    }

    componentWillUnmount(): void {
        super.componentWillUnmount();
        if (this._resetCommandCallbackId) {
            getStore().unsubscribe(this._resetCommandCallbackId);
            getStore().unsubscribe(this._storeCtxCallbackId);
        }
        if (this._searchResolverController) {
            this._searchResolverController.clearTimer();
        }
    }

    shouldComponentUpdate(nextProps: ISearchInputOptions, nextState): boolean {
        const currentDisplayValue = this._viewModel.displayValue;
        const res = super.shouldComponentUpdate(nextProps, nextState);
        if (
            this.props.value !== nextProps.value &&
            (nextProps.value !== currentDisplayValue || (!nextProps.value && !currentDisplayValue))
        ) {
            this._updateSearchData(nextProps.value, nextProps.minSearchLength, this.props.value);
        }
        return res;
    }

    private _updateSearchData(
        inputSearchValue: string,
        minSearchLength: number,
        currentValue: string
    ): void {
        const searchResolver = this._getSearchResolverController();
        if (currentValue !== inputSearchValue) {
            const currentValueLength = currentValue?.length;
            if (!inputSearchValue) {
                searchResolver.clearTimer();
            }
            if (currentValueLength !== inputSearchValue?.length) {
                searchResolver.setSearchStarted(inputSearchValue?.length >= minSearchLength);
            }
        }
    }

    protected _renderStyle(): string {
        let style: string;
        if (this.props.contrastBackground || this.props.designContextValue?.contrastBackground) {
            style = 'searchContrast';
        } else {
            style = 'search';
        }
        return style;
    }

    protected _getViewModelOptions(options) {
        return {
            maxLength: options.maxLength,
            constraint: options.constraint,
        };
    }

    protected _getViewModelConstructor() {
        return ViewModel;
    }

    protected _initProperties(): void {
        super._initProperties.apply(this, arguments);

        const CONTROL_NAME = 'Search';
        this._field.scope.controlName = CONTROL_NAME;
        this._readOnlyField.scope.controlName = CONTROL_NAME;

        this._rightFieldWrapper.template = SearchButtonRightTemplate;
        this._rightFieldWrapper.scope.isVisibleReset = _private.isVisibleResetButton.bind(this);
        this._rightFieldWrapper.scope.getIconSize = _private.getIconSize.bind(this);
        this._rightFieldWrapper.scope.onResetClick = this._resetClick.bind(this);
        this._rightFieldWrapper.scope.onResetMousedown = this._resetMousedown.bind(this);
        this._rightFieldWrapper.scope.onSearchClick = this._searchClick.bind(this);

        this._leftFieldWrapper.template = SearchButtonLeftTemplate;
        this._leftFieldWrapper.scope.getIconSize = _private.getIconSize.bind(this);
        this._leftFieldWrapper.scope.onSearchClick = this._searchClick.bind(this);
    }

    protected _notifyInputCompleted(): void {
        this._trimValue();

        super._notifyInputCompleted.apply(this, arguments);
    }

    protected _resetSearch(): void {
        this.props.onResetClick?.(this._getCustomEvent('resetClick'));

        if (this._viewModel) {
            this._viewModel.displayValue = '';
        }
        this._getSearchResolverController().setSearchStarted(false);
        this._notifyValueChanged();
        this._notifySearchReset();
        const field = this._getField();
        if (field && field.fixedChangeEventController) {
            field.fixedChangeEventController();
        }
    }

    protected _resetClick(): void {
        if (this._getReadOnly()) {
            return;
        }
        this._resetSearchHandler();
    }

    protected _resetSearchHandler(): void {
        // move focus from clear button to input
        this.activate();
        this._resetSearch();
    }

    protected _resetMousedown(event): void {
        event.stopPropagation();
        event.preventDefault();
    }

    protected _searchClick(event: SyntheticEvent): void {
        if (this._getReadOnly()) {
            return;
        }

        this._trimValue();
        this._notifySearchClick(event);

        // move focus from search button to input
        this.activate();
    }

    private _getSearchResolverController(): SearchResolver {
        if (!this._searchResolverController) {
            this._searchResolverController = this._initializeSearchResolverController(this.props);
        }

        return this._searchResolverController;
    }

    private _initializeSearchResolverController(options: ISearchInputOptions): SearchResolver {
        return new SearchResolver({
            searchDelay: options.searchDelay,
            minSearchLength: options.minSearchLength,
            searchValueTrim: options.searchValueTrim,
            searchCallback: this._notifySearch.bind(this),
            searchResetCallback: this._notifySearchReset.bind(this),
        });
    }

    protected _notifySearch(value: string): void {
        this._resolve(value, 'search');
    }

    protected _notifySearchReset(): void {
        this._resolve('', 'searchReset');
    }

    private _resolve(value: string, event: 'searchReset' | 'search'): void {
        if (event === 'searchReset') {
            this.props.onSearchReset?.(value);
        } else {
            this.props.onSearch?.(value);
        }
    }

    protected _notifyValueChanged(): void {
        super._notifyValueChanged.apply(this, arguments);
        this._getSearchResolverController().resolve(this._viewModel.displayValue);
    }

    protected _notifySearchClick(event): void {
        this.props.onSearchClick?.(this._getCustomEvent('searchClick'), event.nativeEvent);

        if (this._viewModel.displayValue) {
            this._getSearchResolverController().setSearchStarted(true);
            this._resolve(this._viewModel.displayValue, 'search');
        }
    }

    protected _keyDownHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (event.nativeEvent.which === constants.key.enter) {
            this._searchClick(event);
        }

        super._keyDownHandler.apply(this, arguments);
    }

    protected _inputHandler(): void {
        super._inputHandler.apply(this, arguments);

        this._wasActionUser = true;
    }

    protected _clickHandler(): void {
        super._clickHandler.apply(this, arguments);

        this._wasActionUser = true;
    }

    private _trimValue(): void {
        if (this.props.trim) {
            const trimmedValue = this._viewModel.displayValue.trim();

            if (trimmedValue !== this._viewModel.displayValue) {
                this._viewModel.displayValue = trimmedValue;
                this._notifyValueChanged();
            }
        }
    }

    reset(): void {
        if (!this._options.readOnly) {
            this._resetSearch();
        }
    }

    search(event?: SyntheticEvent): void {
        this._searchClick(event);
    }

    static _private = _private;

    static defaultProps = {
        ...Base.defaultProps,
        borderVisibility: 'hidden',
        contrastBackground: false,
        placeholder: rk('Найти'),
        horizontalPadding: 'null',
        searchButtonVisible: true,
        validationStatus: 'valid',
        spellcheck: false,
        searchButtonAlign: 'right',
        resetButtonVisible: true,
        minSearchLength: 3,
        searchDelay: 500,
        searchClickThrottle: true,
    };

    static getOptionTypes(): object {
        const optionTypes = Base.getOptionTypes();

        optionTypes.maxLength = descriptor(Number, null);
        optionTypes.trim = descriptor(Boolean);
        optionTypes.constraint = descriptor(String);

        return optionTypes;
    }
}

/**
 * @event searchClick Происходит при клике на кнопку поиска или при нажатии на клавишу Enter.
 * @name Controls/_search/Input/Search#searchClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object} nativeEvent Объект нативного события браузера.
 */

/**
 * @event resetClick Происходит при клике на кнопку сброса.
 * @name Controls/_search/Input/Search#resetClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/*
 * @event Occurs when search button is clicked.
 * @name Controls/_suggest/Input/Search/Suggest#searchClick
 * @example
 * WML:
 * <pre>
 *     <Controls-ListEnv.SuggestSearch on:searchClick="_searchClick()" bind:value="_value">
 *        ...
 *     </Controls-ListEnv.SuggestSearch>
 * </pre>
 *
 * TS:
 * <pre>
 *     protected _value: string = '';
 *     private _searchClick():boolean {
 *       return this._value.length < 3;
 *     }
 * </pre>
 */

/*
 * @event Occurs when search button is clicked.
 * @name Controls/_search/Input/Search#searchClick
 */
/*
 * @event Occurs when reset button is clicked.
 * @name Controls/_search/Input/Search#resetClick
 */

/**
 * @name Controls/_search/Input/Search#searchButtonVisible
 * @cfg {Boolean} Определяет отображение иконки лупы внутри поля поиска, клик по которой запускает поиск.
 * @default true
 * @remark
 * * true - иконка отображается.
 * * false - иконка не отображается.
 * @demo Controls-demo/Search/Input/SearchButtonVisible/Index
 */

/**
 * @name Controls/_search/Input/Search#contrastBackground
 * @cfg {Boolean} Определяет контрастность фона контрола по отношению к его окружению.
 * @default false
 * @remark
 * Опция используется для визуального выделения контрола, относительно окружения.
 * Например в ситуации когда цвет окружения, близкий к цвету самого контрола.
 * @demo Controls-demo/Search/Input/Base/Index
 * @example
 * У кнопки контрастный фон.
 * <pre>
 *    <Controls.search:Input contrastBackground="{{true}}" bind:value="_searchValue"/>
 * </pre>
 * @see style
 */

/**
 * Определяет наличие пробельных символов в начале и конце значения, после завершения ввода.
 * @name Controls/_interface/ISearch#trim
 * @cfg {Boolean}
 * @default false
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.search:Input trim="{{trim}}"/>
 * </pre>
 */

/**
 * @name Controls/_interface/IInputPlaceholder#placeholder
 * @cfg
 * @default Найти
 * @remark
 * Значение по умолчанию определяется {@link https://www.figma.com/proto/fLpLW1vBm7H88TenFl0GCv/%D0%A1%D1%82%D1%80%D0%BE%D0%BA%D0%B0-%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0?page-id=0%3A1&node-id=1167-9491&viewport=45%2C107%2C0.85&scaling=min-zoom&starting-point-node-id=1167%3A9491&hide-ui=1 стандартом}. Если ваше значение совпадает со значением из стандрта, то задавать его не надо.
 */

/**
 * Сбрасывает значение в строке поиска
 * @name  Controls/_search/Input/Search#reset
 * @function
 * @example
 * <pre class="brush: js">
 * // TS
 * private _resetSearchValue():void {
 *     this._children.search.reset();
 * }
 * </pre>
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.buttons:Button caption='Reset filter' on:click='_resetFilter()'/>
 * <Controls.search:Input name='search'>
 *     ...
 * </Controls.search:Input>
 * </pre>
 */

export default Search;
