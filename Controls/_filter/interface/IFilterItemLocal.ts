/**
 * Настройки элемента фильтра для панели или окна фильтров
 * @public
 */
export interface IFilterItemLocalProps {
    /**
     * Определяет режим отображения фильтра
     * @variant basic Фильтр, отображаемый в блоке "Отбираются".
     * @variant extended Фильтр, отображаемый в блоке "Можно отобрать".
     * @remark
     * При указании viewMode: 'extended' необходимо дополнительно настроить текст метки в опции {@link extendedCaption}
     */
    viewMode?: 'basic' | 'extended';
    /**
     * Текст метки редактора фильтра
     * @example
     * <pre class="brush: js; highlight: [3]">
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        window: {
     *            caption: "Город"
     *        }
     *   }]
     * </pre>
     */
    caption?: string;
    /**
     * Текст, который выводится в блоке "Можно отобрать", когда значение для фильтра не выбрано
     * Актуально для фильтров с {@link viewMode} extended
     * @example
     * <pre class="brush: js; highlight: [4]">
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        viewMode: 'basic',
     *        window: {
     *            extendedCaption: "Город"
     *            viewMode: 'extended'
     *        }
     *   }]
     * </pre>
     */
    extendedCaption?: string;
    /**
     * Имя редактора фильтра
     * @variant Controls/filterPanel:ListEditor редактор выбора из справочника в виде {@link Controls/filterPanel:ListEditor списка}
     * @variant Controls/filterPanelEditors:Lookup редактор выбора из справочника в виде {@link Controls/filterPanelEditors:Lookup кнопки выбора}
     * @variant Controls-ListEnv/filterPanelExtEditors:NumberRangeEditor редактор {@link Controls-ListEnv/filterPanelExtEditors:NumberRangeEditor диапазона чисел}
     * @variant Controls/filterPanelEditors:Dropdown редактор перечисляемого типа в виде {@link Controls/filterPanelEditors:Dropdown меню}
     * @variant Controls-ListEnv/filterPanelExtEditors:TumblerEditor редактор перечисляемого типа в виде {@link Controls-ListEnv/filterPanelExtEditors:TumblerEditor переключателя}
     * @variant Controls/filterPanelEditors:Boolean редактор {@link Controls/filterPanelEditors:Boolean логического типа}
     * @variant Controls/filterPanelEditors:Date редактор {@link Controls/filterPanelEditors:Date даты}
     * @variant Controls/filterPanelEditors:DateRange редактор для {@link Controls/filterPanelEditors:DateRange диапазона дат}
     * @example
     * <pre class="brush: js; highlight: [5]">
     *    import {Memory} from 'Types/source'
     *   this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        window: {
     *          editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
     *          editorOptions: {
     *              ...
     *          }
     *        }
     *   }]
     * </pre>
     */
    editorTemplateName?: string;
    /**
     * Опции для редактора.
     * @example
     * <pre class="brush: js; highlight: [6-23]">
     *    import {Memory} from 'Types/source'
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        window: {
     *          editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
     *          editorOptions: {
     *              source: new Memory({
     *                  data: [
     *                      {
     *                          id: 'Yaroslavl',
     *                          title: 'Ярославль'
     *                      },
     *                      {
     *                          id: 'Moscow',
     *                          title: 'Москва'
     *                      },
     *                      {
     *                          id: 'Rostow',
     *                          title: 'Ростов'
     *                      }
     *                  ],
     *                  keyProperty: 'id'
     *              }),
     *              displayProperty: 'title',
     *              keyProperty: 'id'
     *          }
     *        }
     *   }]
     * </pre>
     */
    editorOptions?: Record<string, unknown>;
}

export type TFilterItemLocalName = keyof IFilterItemLocalProps;

export interface IFilterItemLocalPropsInternal {
    filterItemLocalProperty?: TFilterItemLocalName;
}

/**
 * Интерфейс для элементов фильтра, поддерживающих настройку редактора фильтра отдельно для панели и для окна
 * @public
 */
export default interface IFilterItemLocal {
    /**
     *  Настройки элемента фильтра для окна фильтров
     *  @remark
     *  Используется, когда требуется переопределить настройки для редактора на окне фильтров,
     *  например задать другую метку или настройки редактора
     *  @example
     *  <pre class="brush: js; highlight: [8-12]">
     *      const filterDescription = [{
     *          name: 'city',
     *          value: 'Yaroslavl',
     *          resetValue: null,
     *          editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
     *          ...
     *
     *          window: {
     *              caption: 'Город',
     *              viewMode: 'extended',
     *              extendedCaption: 'Город'
     *          }
     *
     *          panel: {
     *              viewMode: 'basic'
     *          }
     *      }]
     *  </pre>
     *  @demo Controls-ListEnv-demo/FilterPanel/View/Source/PanelOptions/Index
     */
    window?: IFilterItemLocalProps;
    /**
     *  Настройки элемента фильтра для панели фильтров
     *  @remark
     *  Используется, когда требуется определить настройки для редактора в панели фильтров,
     *  например задать другую метку или настройки редактора
     *  @example
     *  <pre class="brush: js; highlight: [12-15]">
     *      const filterDescription = [{
     *          name: 'city',
     *          value: 'Yaroslavl',
     *          resetValue: null,
     *          editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
     *          ...
     *
     *          window: {
     *              viewMode: 'basic',
     *          }
     *
     *          panel: {
     *              viewMode: 'extended',
     *              extendedCaption: 'Город'
     *          }
     *      }]
     *  </pre>
     *  @demo Controls-ListEnv-demo/FilterPanel/View/Source/PanelOptions/Index
     */
    panel?: IFilterItemLocalProps;
}
