/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
/**
 * @typedef {Object} ISuggestTemplateProp
 * @description Свойства объекта {@link suggestTemplate}.
 * @property {String} templateName Имя контрола, который будет отображаться в выпадающем блоке.
 * @property {Object} templateOptions Опции для контрола, который будет отображаться в выпадающем блоке.
 */

/*
 * @typedef {Object} ISuggestTemplateProp
 * @property {String} templateName Control name, that will be displayed list of items in suggest.
 * @property {Object} templateOptions Options for control , which is specified in the templateName field.
 */
export interface ISuggestTemplateProp {
    templateName: string;
    templateOptions: object;
}

/**
 * @typedef {Object} IEmptyTemplateProp
 * @description Свойства объекта {@link emptyTemplate}.
 * @property {String} templateName Имя шаблона пустого автодополнения, которое будет отображаться, когда результат не найден.
 * @property {Object} templateOptions Параметры шаблона, которые указаны в поле templateName.
 */

/*
 * @typedef {Object} IEmptyTemplateProp
 * @property {String} templateName Template name for suggest, which will showing when no result were found.
 * @property {Object} templateOptions Options for template, which is specified in the templateName field.
 */
export interface IEmptyTemplateProp {
    templateName: string;
    templateOptions: object;
}

/**
 * @typedef {Object} ISuggestFooterTemplate
 * @description Свойства объекта {@link footerTemplate}.
 * @property {String} templateName Имя шаблона, которое будет отображаться в нижней части автодополнения.
 * @property {Object} templateOptions Параметры шаблона, которые указаны в поле templateName.
 */

/*
 * @typedef {Object} ISuggestFooterTemplate
 * @property {String} templateName Name of template, which will showing in bottom of suggest.
 * @property {Object} templateOptions Options for template, which is specified in the templateName field.
 */
export interface ISuggestFooterTemplate {
    templateName: string;
    templateOptions: object;
}

/**
 * Интерфейс для {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ автодополнения}.
 * @interface Controls/_interface/ISuggest
 * @public
 */

/*
 * Interface for auto-completion.
 *
 * @public
 * @author Gerasimov A.M.
 */
interface ISuggest {
    readonly _options: {
        /**
         * @name Controls/_interface/ISuggest#suggestTemplate
         * @cfg {ISuggestTemplateProp|null} Шаблон {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ автодополнения}, который отображает результаты поиска.
         * @remark
         * По умолчанию в качестве шаблона используется {@link Controls/suggestPopup:SuggestTemplate}.
         * Корневым контролом автодополнения должен быть {@link Controls/suggestPopup:ListContainer}, этому контролу можно передать в контентной опции контрол ({@link Controls/list:View} или {@link Controls/grid:View}), который отобразит список.
         * Вы можете установить ширину окна с автодополнением, добавив собственный класс в suggestTemplate и установив минимальную ширину. По умолчанию ширина автодополнения равна ширине поля ввода.
         * Для отключения автодополнения у поля ввода опцию передайте значение null в опцию suggestTemplate.
         * @demo Controls-demo/Suggest_new/SearchInput/SuggestTemplate/SuggestTemplate
         * @editor function
         * @example
         * <pre class="brush: html">
         * <!-- suggestTemplate.wml -->
         * <Controls.suggestPopup:ListContainer attr:class="myClass">
         *    <Controls.list:View keyProperty="id">
         *       <ws:itemTemplate>
         *          <ws:partial template="Controls/list:ItemTemplate" displayProperty="city"/>
         *       </ws:itemTemplate>
         *    </Controls.list:View>
         * </Controls.suggestPopup:ListContainer>
         * </pre>
         *
         * <pre class="brush: css">
         * .myClass {
         *    min-width: 300px;
         * }
         * </pre>
         * <pre class="brush: html">
         * <!-- WML -->
         * <Controls.SuggestInput>
         *    <ws:suggestTemplate templateName="wml!SuggestTemplate">
         *       <ws:templateOptions />
         *    </ws:suggestTemplate>
         * </Controls.SuggestInput>
         * </pre>
         */

        /*
         * @cfg {ISuggestTemplateProp|null} Template for suggest, that showing search results.
         * @remark Root control of suggest must be {@link Controls/suggestPopup:ListContainer}, for this control you can pass in content option a control (such {@link Controls/list:View} or {@link Controls/grid:View}), that will displaying a list.
         * @remark You can set width of suggestions popup by adding own class on suggestTemplate and set min-width by this class. By default width of the suggest is equal input field width.
         * @demo Controls-demo/Suggest_new/SearchInput/SuggestTemplate/SuggestTemplate
         * @editor function
         * @example
         * <pre class="bruhs: html">
         * <!-- suggestTemplate.wml -->
         * <Controls.suggestPopup:ListContainer attr:class="myClass">
         *    <Controls.list:View keyProperty="id">
         *       <ws:itemTemplate>
         *          <ws:partial template="Controls/list:ItemTemplate" displayProperty="city"/>
         *       </ws:itemTemplate>
         *    </Controls.list:View>
         * </Controls.suggestPopup:ListContainer>
         * </pre>
         *
         * <pre class="bruhs: css">
         * .myClass {
         *    min-width: 300px;
         * }
         * </pre>
         * <pre class="bruhs: css">
         * <!-- WML -->
         * <Controls.SuggestInput>
         *    <ws:suggestTemplate templateName="wml!SuggestTemplate">
         *       <ws:templateOptions />
         *    </ws:suggestTemplate>
         * </Controls.SuggestInput>
         * </pre>
         */
        suggestTemplate: ISuggestTemplateProp | null;

        /**
         * @name Controls/_interface/ISuggest#emptyTemplate
         * @cfg {IEmptyTemplateProp|null} Шаблон, который будет отображаться в {@link /doc/platform/developmentapl/_interface-development/controls/input-elements/input/suggest/ автодополнении}, если поисковой запрос не вернул результатов.
         * @remark Если опция имеет значение null, то автодополнение не отобразится, если поисковой запрос не вернул результатов.
         * @demo Controls-demo/Suggest_new/SearchInput/EmptyTemplate/EmptyTemplate
         * @example
         * <pre class="brush: html">
         * <!-- emptyTemplate.wml -->
         *    <div class="emptyTemplate-class">Sorry, no data today</div>
         * </pre>
         *
         * <pre class="brush: html">
         * <!-- MySuggest.wml -->
         * <Controls.SuggestInput>
         *    <ws:emptyTemplate templateName="wml!emptyTemplate">
         *       <ws:templateOptions showImage={{_showImage}}/>
         *    </ws:emptyTemplate>
         * </Controls.SuggestInput>
         * </pre>
         */

        /*
         * @cfg {IEmptyTemplateProp|null} Template for suggest when no results were found.
         * @remark If option set to null, empty suggest won't appear.
         * @demo Controls-demo/Suggest_new/SearchInput/EmptyTemplate/EmptyTemplate
         * @example
         * <pre class="brush: html">
         * <!-- emptyTemplate.wml -->
         *    <div class="emptyTemplate-class">Sorry, no data today</div>
         * </pre>
         *
         * <pre class="brush: html">
         * <!-- MySuggest.wml -->
         * <Controls.SuggestInput>
         *    <ws:emptyTemplate templateName="wml!emptyTemplate">
         *       <ws:templateOptions showImage={{_showImage}}/>
         *    </ws:emptyTemplate>
         * </Controls.SuggestInput>
         * </pre>
         */
        emptyTemplate: IEmptyTemplateProp | null;

        /**
         * @name Controls/_interface/ISuggest#footerTemplate
         * @cfg {ISuggestFooterTemplate} Шаблон подвала {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ автодополнения}.
         * @demo Controls-demo/Suggest_new/SearchInput/FooterTemplate/FooterTemplate
         * @example
         * <pre class="brush: html">
         * <!-- myFooter.wml -->
         * <span on:click="_showTasksClick()">show tasks</span>
         * </pre>
         *
         * <pre class="brush: js">
         * // myFooter.js
         *  class MyControl extends Control<IControlOptions> {
         *       _showTasksClick() {
         *          stackOpener.open();
         *       }
         * }
         * </pre>
         *
         * <pre class="brush: html">
         * <!-- mySuggest.wml -->
         * <Controls.SuggestInput>
         *    <ws:footerTemplate templateName="myFooter"/>
         * </Controls.SuggestInput>
         * </pre>
         * @remark
         * Если вам требуется просто поменять текст для кнопки "Показать всё", которая отображается в подвале автодополнения,
         * необходимо использова стандартный шаблон подвала {@link Controls/suggestPopup:FooterTemplate}
         */

        /*
         * @cfg {ISuggestFooterTemplate} Footer template of suggest.
         * @demo Controls-demo/Suggest_new/SearchInput/FooterTemplate/FooterTemplate
         * @example
         * <pre class="brush: html">
         * <!-- myFooter.wml -->
         * <span on:click="_showTasksClick()">show tasks</span>
         * </pre>
         *
         * <pre class="brush: js">
         * // myFooter.js
         * class MyControl extends Control<IControlOptions> {
         *       _showTasksClick() {
         *          stackOpener.open();
         *       }
         * }
         * </pre>
         *
         * <pre class="brush: html">
         * <!-- mySuggest.wml -->
         * <Controls.SuggestInput>
         *    <ws:footerTemplate templateName="myFooter"/>
         * </Controls.SuggestInput>
         * </pre>
         */
        footerTemplate: ISuggestFooterTemplate;

        /**
         * @name Controls/_interface/ISuggest#historyId
         * @cfg {String} Уникальный идентификатор для сохранения истории выбора записей из {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ автодополнения}.
         * @remark Если элементы были ранее выбраны, автодополнение с этими элементами будет отображаться после того, как на поле ввода перейдет фокус.
         * @example
         * <pre class="brush: html">
         * <!-- WML -->
         * <Controls.SuggestInput historyId="myHistoryId"/>
         * </pre>
         */

        /*
         * @cfg {String} Unique id to save input history.
         * @remark If items were previously selected, suggest with this items will be displayed after input get focused.
         * @example
         * <pre class="brush: html">
         * <!-- WML -->
         * <Controls.SuggestInput historyId="myHistoryId"/>
         * </pre>
         */
        historyId: string;

        /**
         * @name Controls/_interface/ISuggest#autoDropDown
         * @cfg {Boolean} Отобразить {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ автодополнение}, когда на поле ввода перейдет фокус.
         * @example
         * В этом примере автодополнение будет показано после фокусировки на поле ввода.
         * <pre class="brush: html">
         * <!-- WML -->
         * <Controls.SuggestInput autoDropDown="{{true}}" />
         * </pre>
         */

        /*
         * @cfg {Boolean} Show suggest when the input get focused.
         * @example
         * In this example suggest will shown after input get focused.
         * <pre class="brush: html">
         * <!-- WML -->
         * <Controls.SuggestInput autoDropDown="{{true}}" />
         * </pre>
         */
        autoDropDown: boolean;

        /**
         * @name Controls/_interface/ISuggest#suggestPopupOptions
         * @cfg {Controls/popup:IStickyOpener} Конфигурация всплывающего блока {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ автодополнения}.
         * @example
         * В этом примере автодополнение будет открыто вверх.
         * <pre class="brush: js">
         * // myModule.js
         * class MyControl extends Control<IControlOptions> {
         *       _template: template,
         *       _suggestPopupOptions: null,
         *       _beforeMount() {
         *          this._suggestPopupOptions = {
         *             direction : {
         *                vertical: 'bottom',
         *                horizontal: 'right'
         *             },
         *             targetPoint: {
         *                vertical: 'top',
         *                horizontal: 'left'
         *             }
         *          }
         *       });
         *    });
         * }
         * </pre>
         *
         * <pre class="brush: html">
         * <!-- myModule.wml -->
         * <div>
         *    <Controls.SuggestInput suggestPopupOptions="{{_suggestPopupOptions}}"/>
         * </div>
         * </pre>
         */

        /*
         * @cfg {Controls/popup:IStickyOpener} Suggest popup configuration.
         * @example
         * In this example, suggest will open up.
         * <pre class="brush: js">
         * // myModule.js
         * class MyControl extends Control<IControlOptions> {
         *       _template: template,
         *       _suggestPopupOptions: null,
         *       _beforeMount: function() {
         *          this._suggestPopupOptions = {
         *             direction : {
         *                vertical: 'bottom',
         *                horizontal: 'right'
         *             },
         *             targetPoint: {
         *                vertical: 'top',
         *                horizontal: 'left'
         *             }
         *          }
         *       });
         *    });
         * }
         * </pre>
         *
         * <pre class="brush: html">
         * <!-- myModule.wml -->
         * <div>
         *    <Controls.SuggestInput suggestPopupOptions="{{_suggestPopupOptions}}"/>
         * </div>
         * </pre>
         */
        suggestPopupOptions: object;
        dataLoadCallback: Function;
        searchClick: Function;
    };
}

export default ISuggest;
