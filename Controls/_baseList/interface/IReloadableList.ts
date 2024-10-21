/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Интерфейс списочных контролов, для перезагрузки данных из {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
 * @interface Controls/_list/interface/IReloadableList
 * @public
 */

/**
 * Перезагружает данные из {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
 * @name Controls/_list/interface/IReloadableList#reload
 * @markdown
 * @remark
 * При перезагрузке в фильтр уходит список {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/ развернутых узлов} (с целью {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/managing-node-expand/#multi-navigation восстановить пользователю структуру}, которая была до перезагрузки).
 * Принимает опционально конфигурацию источника данных для: {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#cursor навигации по курсору}, {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#page постраничной навигации}, если нужно перезагрузить список с навигацией, отличной от указанной в опциях контрола.
 * Если в списке было запущено {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирование по месту}, то при вызове этого метода редактирование завершится без сохранения изменений (поведение аналогично вызову метода {@link Controls/list:IEditableList#cancelEdit cancelEdit}).
 * @function reload
 * @param {Boolean} [keepNavigation=false] Сохранить ли позицию скролла и состояние навигации после перезагрузки.
 * @param {Controls/_interface/INavigation/IBaseSourceConfig.typedef} [sourceConfig=undefined] Конфигурация навигации источника данных (например, размер и номер страницы для постраничной навигации), которую можно передать при вызове reload, чтобы перезагрузка произошла с этими параметрами.
 * По умолчанию перезагрузка происходит с параметрами, переданными в опции {@link Controls/interface:INavigation#navigation navigation}.
 * @returns {Promise<void>} Возвращает Promise, завершение которого означает окончание процесса перезагрузки.
 * @example
 * В следующем примере показано, как в {@link Controls/list:View плоском списке} выполнить перезагрузку списка с параметрами навигации. Передаваемый параметр {@link Controls/_interface/INavigation/INavigationPositionSourceConfig#field field} необходим для режима {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/data-source/#parametr-source Навигация по курсору}.
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.list:View
 *    source="{{_viewSource}}"
 *    name="list" />
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * this._children.list.reload(true, {
 *     limit: 25,
 *     position: [null, new Date(), null, null, null],
 *     direction: 'both',
 *     field: ['@Документ', 'Веха.Дата', 'ДокументРасширение.Название', 'Раздел', 'Раздел@']
 * });
 * </pre>
 *
 * В следующем примере показано, как в {@link Controls/treeGrid:View дереве с колонками} выполнить перезагрузку с {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/managing-node-expand/#multi-navigation сохранением развёрнутых узлов}.
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.treeGrid:View
 *    source="{{_viewSource}}"
 *    name="treegrid" />
 * </pre>
 * <pre class="brush: js; highlight: [3]">
 * // TypeScript
 * this._children.treegrid.reload(true, {
 *     multiNavigation: true
 * })
 * </pre>
 */

/*
 * Reloads list data and view.
 * @function Controls/_list/interface/IReloadableList#reload
 */
