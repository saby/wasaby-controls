/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { ILookup } from 'Controls/interface';

/**
 * Интерфейс для поля ввода с автодополнением и возможностью выбора значений из нескольких справочников.
 * @public
 */

export default interface IInput extends ILookup {
    readonly '[Controls/_interface/IMultipleInputNew]': boolean;
}

/**
 * Открывает справочник
 * @function Controls/_interface/IMultipleInput#showSelector
 * @returns {Promise}
 * @param {string} name Название поля выбора, справочник которого необходимо открыть
 * @param {Object} popupOptions {@link Controls/popup:IStackOpener.PopupOptions.typedef Опции всплывающего окна}
 *
 * @example
 * Откроем окно с заданными параметрами.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.multipleLookup:Input
 *       name="multiLookup"
 *       bind:selectedKeys="_selectedMultiKeys">
 *    <ws:lookupOptions>
 *       <ws:Array>
 *          <ws:Object
 *                name="directoriesLookup"
 *                source="{{_source}}"
 *                searchParam="title"
 *                keyProperty="id">
 *             <ws:placeholder>
 *                   Specify the
 *                   <Controls.lookup:Link caption="department" on:linkClick="showSelector('department')"/>
 *                   and
 *                   <Controls.lookup:Link caption="company" on:linkClick="showSelector('company')"/>
 *             </ws:placeholder>
 *             <ws:selectorTemplate
 *     templateName="Engine-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs"/>
 *             <ws:suggestTemplate templateName="Controls-demo/Input/Lookup/Suggest/SuggestTemplate"/>
 *          </ws:Object>
 *       <ws:Array>
 *    </ws:lookupOptions>
 * </Controls.multipleLookup:Input>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions> {
 *    ...
 *    showSelector: function(selectedTab) {
 *       this._children.multiLookup.showSelector('directoriesLookup', {
 *          templateOptions: {
 *             selectedTab: selectedTab
 *          }
 *       });
 *    }
 *    ...
 * }
 * </pre>
 */

/**
 * Открывает автодополнение
 * @function Controls/_interface/IMultipleInput#openSuggest
 * @returns {Promise}
 * @param {string} name Название поля выбора, справочник которого необходимо открыть
 *
 * @example
 * Откроем автодополнение для поля выбора директории.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.multipleLookup:Input
 *       name="multiLookup">
 *    <ws:lookupOptions>
 *       <ws:Array>
 *          <ws:Object
 *                name="directoriesLookup"
 *                source="{{_source}}"
 *                searchParam="title"
 *                keyProperty="id">
 *             <ws:placeholder>
 *                   Specify the
 *                   <Controls.lookup:Link caption="department" on:linkClick="openSuggest()"/>
 *             </ws:placeholder>
 *             <ws:selectorTemplate
 *     templateName="Engine-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs"/>
 *             <ws:suggestTemplate templateName="Controls-demo/Input/Lookup/Suggest/SuggestTemplate"/>
 *          </ws:Object>
 *       <ws:Array>
 *    </ws:lookupOptions>
 * </Controls.multipleLookup:Input>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions> {
 *    ...
 *    openSuggest: function() {
 *       this._children.multiLookup.openSuggest('directoriesLookup');
 *    }
 *    ...
 * }
 * </pre>
 */

/**
 * Закрывает автодополнение
 * @function Controls/_interface/IMultipleInput#closeSuggest
 * @returns {Promise}
 * @param {string} name Название поля выбора, справочник которого необходимо закрыть
 *
 * @example
 * Закроем автодополнение для поля выбора директории.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.multipleLookup:Input
 *       name="multiLookup">
 *    <ws:lookupOptions>
 *       <ws:Array>
 *          <ws:Object
 *                name="directoriesLookup"
 *                source="{{_source}}"
 *                searchParam="title"
 *                keyProperty="id">
 *             <ws:placeholder>
 *                   Specify the
 *                   <Controls.lookup:Link caption="department" on:linkClick="closeSuggest()"/>
 *             </ws:placeholder>
 *             <ws:selectorTemplate
 *     templateName="Engine-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs"/>
 *             <ws:suggestTemplate templateName="Controls-demo/Input/Lookup/Suggest/SuggestTemplate"/>
 *          </ws:Object>
 *       <ws:Array>
 *    </ws:lookupOptions>
 * </Controls.multipleLookup:Input>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions> {
 *    ...
 *    closeSuggest: function() {
 *       this._children.multiLookup.closeSuggest('directoriesLookup');
 *    }
 *    ...
 * }
 * </pre>
 */
