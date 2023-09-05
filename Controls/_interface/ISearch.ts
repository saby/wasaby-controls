/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface ISearchOptions {
    searchParam?: string;
    minSearchLength?: number;
    searchDelay?: number;
    searchValueTrim?: boolean;
    searchValue?: string;
}
/**
 * Интерфейс для ввода запроса в поле поиска.
 * @public
 */

/*
 * Interface for Search inputs.
 * @interface Controls/_interface/ISearch
 * @public
 * @author Золотова Э.Е.
 */
export default interface ISearch {
    readonly '[Controls/_interface/ISearch]': boolean;
}

/**
 * @name Controls/_interface/ISearch#searchValueTrim
 * @cfg {Boolean} Определяет, удалять ли пробелы у текста для поиска.
 * @remark
 * Пробелы удаляются только для текста, который отправляется в поисковой запрос,
 * текст в поле ввода при этом будет продолжать содержать пробелы.
 * @default false
 * @example
 * В этом примере в поисковой запрос будет отправлен текст "Ярославль".
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.SuggestInput searchDelay="{{1000}}" searchParam="city" value="  Ярославль   "/>
 * </pre>
 */
/**
 * Determines whether search value is trimmed.
 * @name Controls/_interface/ISearch#searchValueTrim
 * @cfg {Boolean}
 * @default false
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.SuggestInput searchDelay="{{1000}}" searchParam="city" value="  Yaroslavl   "/>
 * </pre>
 */

/**
 * @name Controls/_interface/ISearch#searchDelay
 * @cfg {Number} Задержка между вводом символа и выполнением поискового запроса.
 * @remark
 * После ввода каждого символа задержка будет запущена заново.
 * Нулевая задержка имеет смысл для локальных данных, но может создавать большую нагрузку для удаленных данных.
 * Значение задается в миллисекундах.
 * @default 500
 * @demo Controls-demo/dropdown_new/Search/SearchDelay/Index
 * @example
 * В этом примере поиск начнется после 1 сек задержки.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.SuggestInput searchDelay="{{1000}}" searchParam="city"/>
 * </pre>
 */

/*
 * @name Controls/_interface/ISearch#searchDelay
 * @cfg {Number} The delay between when a symbol was typed and when a search is performed.
 * @remark
 * A zero-delay makes sense for local data (more responsive), but can produce a lot of load for remote data, while being less responsive.
 * Value is set in milliseconds.
 * @demo Controls-demo/dropdown_new/Search/SearchDelay/Index
 * @example
 * In this example search will start after 1s delay.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.SuggestInput searchDelay="{{1000}}" searchParam="city"/>
 * </pre>
 */

/**
 * @name Controls/_interface/ISearch#minSearchLength
 * @cfg {Number} Минимальное количество символов, которое пользователь должен ввести для выполнения поискового запроса.
 * @default 3
 * @demo Controls-demo/dropdown_new/Search/MinSearchLength/Index
 * @remark
 * Ноль подойдет для локальных данных с несколькими элементами, но более высокое значение следует использовать, когда поиск одного символа может соответствовать нескольким тысячам элементов.
 * @example
 * В этом примере поиск начинается после ввода 2 символа.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.SuggestInput
 *     minSearchLength="{{2}}"
 *     searchParam="city">
 *     <ws:suggestTemplate templateName="Controls/suggestPopup:SuggestTemplate"/>
 * </Controls.SuggestInput>
 * </pre>
 */

/*
 * @name Controls/_interface/ISearch#minSearchLength
 * @cfg {Number} The minimum number of characters a user must type before a search is performed.
 * @remark
 * Zero is useful for local data with just a few items, but a higher value should be used when a single character search could match a few thousand items.
 * @demo Controls-demo/dropdown_new/Search/MinSearchLength/Index
 * @example
 * In this example search starts after typing 2 characters.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.SuggestInput
 *     minSearchLength="{{2}}"
 *     searchParam="city">
 *     <ws:suggestTemplate templateName="Controls/suggestPopup:SuggestTemplate"/>
 * </Controls.SuggestInput>
 * </pre>
 */

/**
 * @name Controls/_interface/ISearch#searchParam
 * @cfg {String} Имя поля фильтра, в значение которого будет записываться текст для поиска.
 * Фильтр с этим значением будет отправлен в поисковой запрос к источнику данных.
 * @demo Controls-demo/dropdown_new/Search/SearchParam/Index
 * @example
 * В этом примере вы можете найти город, введя название города.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.SuggestInput
 *     minSearchLength="{{2}}"
 *     searchParam="city">
 *     <ws:suggestTemplate templateName="Controls/suggestPopup:SuggestTemplate"/>
 * </Controls.SuggestInput>
 * </pre>
 */

/*
 * @name Controls/_interface/ISearch#searchParam
 * @cfg {String} Name of the field that search should operate on. Search value will insert in filter by this parameter.
 * @demo Controls-demo/dropdown_new/Search/SearchParam/Index
 * @example
 * In this example you can search city by typing city name.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.SuggestInput
 *     minSearchLength="{{2}}"
 *     searchParam="city">
 *     <ws:suggestTemplate templateName="Controls/suggestPopup:SuggestTemplate"/>
 * </Controls.SuggestInput>
 * </pre>
 */

/**
 * @name Controls/_interface/ISearch#filterOnSearchCallback
 * @cfg {Function} Функция для фильтрации записей, синхронно вызывается при изменении поискового значения.
 * В функцию передаётся два аргумента: поисковое значение и запись.
 * Если функция возвращает true, то запись остаётся в списке.
 * @demo Controls-demo/Search/Browser/PreFilterSearchCallback/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.browser:Browser searchParam="comment" filterOnSearchCallback="{{_filterOnSearchCallback}}">
 *     <div>
 *         <Controls.search:InputContainer>
 *             <Controls.search:Input/>
 *         </Controls.search:InputContainer>
 *
 *         <Controls.list:Container>
 *             <Controls.list:View/>
 *         </Controls.list:Container>
 *     </div>
 * </Controls.browser:Browser>
 * </pre>
 * <pre class="brush: js">
 *    import {Memory} from 'Types/source';
 *    this._source = new Memory ({
 *       data: [
 *           { id: 1,
 *             title: 'Discussion',
 *             comment: 'Create a discussion to find out the views of other group members on this issue' },
 *           { id: 2,
 *             title: 'Idea/suggestion',
 *             comment: 'Offer your idea, which others can not only discuss, but also evaluate.
 *             The best ideas will not go unnoticed and will be realized' },
 *           { id: 3,
 *             title: 'Problem',
 *             comment: 'Do you have a problem? Tell about it and experts will help to find its solution' }
 *       ],
 *       keyProperty: 'id'
 *    });
 *    this._filterOnSearchCallback = (searchValue, item) => {
 *        return item.get('title').includes(searchValue);
 *    }
 * </pre>
 * @see searchParam
 * @see searchValue
 */
