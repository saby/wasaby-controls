/**
 * @kaizen_zone 51901a13-bec5-4da2-8548-f6477dc9eaf6
 */
import * as React from 'react';
import { DesignContext } from 'Controls/design';
import Search from './Search';
import { ISearchInputOptions } from './Search';
import { wasabyAttrsToReactDom } from 'UICore/Executor';

/**
 * Контрол "Строка поиска". Является однострочным полем ввода. Контрол используют в реестрах для ввода поискового запроса.
 * Функционал контрола идентичен полям ввода из библиотеки {@link Controls/input}, однако в отличие от них имеет собственное визуальное оформление.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/linking-search-string-to-list/ руководство разработчика по классификации контролов Wasaby и схеме их взаимодействия}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_search.less переменные тем оформления}
 *
 * @mixes Controls/search:Input
 * @extends Controls/_input/Base
 *
 * @mixes Controls/input:IText
 * @implements Controls/interface:IContrastBackground
 * @implements Controls/interface:IInputPlaceholder
 *
 * @ignoreoptions style
 * @ignoreoptions borderVisibility
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
export default class WrappedSearch<IProps = ISearchInputOptions> extends React.Component<IProps> {
    protected _ref: {} = React.createRef();

    paste(...args: Parameters<Search['paste']>): ReturnType<Search['paste']> {
        return this._ref.current.paste(...args);
    }

    reset(...args: Parameters<Search['reset']>): ReturnType<Search['reset']> {
        return this._ref.current.reset(...args);
    }

    search(...args: Parameters<Search['search']>): ReturnType<Search['search']> {
        return this._ref.current.search(...args);
    }

    select(): ReturnType<Search['select']> {
        return this._ref.current.select();
    }

    activate(): ReturnType<Search['activate']> {
        // TODO: Перейти на другой механизм управления фокусом в местах использования контрола.
        // Используется в платформенных контролах в разных репозиториях.
        // Подозреваю что может использоваться и прикладниками.
        return this._ref.current?.activate();
    }

    _getTooltip(...args: Parameters<Search['_getTooltip']>): ReturnType<Search['_getTooltip']> {
        return this._ref.current._getTooltip(...args);
    }

    render(): React.ReactElement {
        const attrs = wasabyAttrsToReactDom(this.props.attrs) || {};
        return (
            <Search
                {...this.props}
                attrs={{
                    ...attrs,
                    style: {
                        ...attrs?.style,
                        ...this.props.style,
                    },
                }}
                forwardedRef={this.props.forwardedRef}
                ref={this._ref}
                designContextValue={this.context}
                className={`controls-notFocusOnEnter ${this.props.className}`}
            />
        );
    }

    static contextType = DesignContext;
}

/**
 * @event Происходит при клике на кнопку поиска или при нажатии на клавишу Enter.
 * @name Controls/_search/Input/WrappedSearch#searchClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object} nativeEvent Объект нативного события браузера.
 * @remark Первый клик по кнопке поиска и enter вызовет синхронное срабатывание соыбтия searchClick,
 * последующие клики будут игнорироваться в течение 300мс. Задержка сделана для защиты от закликивания (https://en.wikipedia.org/wiki/Clickjacking)
 * Если вам требуется обрабатывать все клики без задержки, то установите опцию  {@link searchClickThrottle}
 */

/**
 * @event Controls/_search/Input/WrappedSearch#resetClick Происходит при клике на кнопку сброса.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/**
 * @event Происходит при начале поиска.
 * @name Controls/_search/Input/WrappedSearch#search
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {value} string Значение по которому производится поиск.
 */

/**
 * @event Происходит при сбросе поиска.
 * @name Controls/_search/Input/WrappedSearch#searchReset
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
 * @name Controls/_search/Input/WrappedSearch#searchClick
 */
/*
 * @event Occurs when reset button is clicked.
 * @name Controls/_search/Input/WrappedSearch#resetClick
 */

/**
 * @name Controls/_search/Input/WrappedSearch#searchButtonAlign
 * @cfg {String} Определяет, с какой стороны расположена иконка лупы.
 * @variant left Иконка лупы расположена слева.
 * @variant right Иконка лупы расположена справа.
 * @default right
 * @demo Controls-demo/Search/Input/SearchButtonAlign/Index
 */

/**
 * @name Controls/_search/Input/Search#searchClickThrottle
 * @cfg {boolean} Включает специальную задержку, которая отменяет повторные срабатывания события {@link searchClick} при нажатии на кнопку лупы или на enter в течении 300мс.
 * Является защитой от атаки типа clickjacking. См. {@link https://en.wikipedia.org/wiki/Clickjacking подробнее}.
 * @variant true Задержка есть.
 * @variant false Задержки нет.
 * @default true
 * @remark Внимание! Опцию нужно использовать с осторожностью.
 */

/**
 * @name Controls/_search/Input/WrappedSearch#searchButtonIconStyle
 * @cfg {String} Цвет иконки лупы. См. {@link Controls/interface:IIconStyle#iconStyle подробнее}.
 * @demo Controls-demo/Search/ExpandableInput/SearchButtonIconStyle/Index
 */

/**
 * @name Controls/_search/Input/WrappedSearch#searchButtonVisible
 * @cfg {Boolean} Определяет отображение иконки лупы внутри поля поиска, клик по которой запускает поиск.
 * @default true
 * @remark
 * * true - иконка отображается.
 * * false - иконка не отображается.
 */

/**
 * @name Controls/_search/Input/WrappedSearch#contrastBackground
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
 * @name Controls/_search/Input/WrappedSearch#trim
 * @cfg {Boolean} Определяет наличие пробельных символов в начале и конце значения, после завершения ввода.
 * @default false
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.search:Input trim="{{trim}}"/>
 * </pre>
 */

/**
 * @name Controls/_search/Input/WrappedSearch#placeholder
 * @cfg {String}
 * @default Найти
 * @remark
 * Значение по умолчанию определяется {@link https://www.figma.com/proto/fLpLW1vBm7H88TenFl0GCv/%D0%A1%D1%82%D1%80%D0%BE%D0%BA%D0%B0-%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0?page-id=0%3A1&node-id=1167-9491&viewport=45%2C107%2C0.85&scaling=min-zoom&starting-point-node-id=1167%3A9491&hide-ui=1 стандартом}. Если ваше значение совпадает со значением из стандрта, то задавать его не надо.
 */

/**
 * Сбрасывает значение в строке поиска
 * @name  Controls/_search/Input/WrappedSearch#reset
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
