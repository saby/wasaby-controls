/* eslint-disable */
define('Controls/interface/IRemovable', [], function () {
   /**
    * Интерфейс для удаления элементов в коллекциях.
    *
    * @interface Controls/interface/IRemovable
    * @public
    */
   /*
    * Interface for item removal in collections.
    *
    * @interface Controls/interface/IRemovable
    * @public
    * @author Авраменко А.С.
    */
   /**
    * @typedef {String} SelectionType
    * @variant {'all'} - все записи.
    * @variant {'leaf'} - листья.
    * @variant {'node'} - узлы.
    */
   /**
    * @typedef {String} SelectionType
    * @variant {'all'} - all records.
    * @variant {'leaf'} - leaves.
    * @variant {'node'} - nodes.
    */
   /**
    * @typedef {Object} Selection
    * @property {Number[] | String[]} selected Массив выбранных ключей.
    * @property {Number[] | String[]} excluded Массив исключенных из выборки ключей.
    * @property {SelectionType} type Тип элементов.
    */
   /*
    * @typedef {Object} Selection
    * @property {Number[] | String[]} selected Array of selected keys.
    * @property {Number[] | String[]} excluded Array of excluded keys.
    * @property {Selection} type Type of elements.
    */
   /**
    * @event Controls/interface/IRemovable#beforeItemsRemove Происходит перед удалением элемента.
    * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
    * @param {Array.<String>|Array.<Number>} idArray Массив элементов для удаления.
    * @returns {Types/deferred:Deferred} Если deferred был выполнен с false, то логика по умолчанию не будет выполнена.
    * @example
    * В следующем примере показано, как отобразить диалоговое окно с вопросом перед удалением элементов.
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.listDeprecate:Remover name="listRemover" on:beforeItemsRemove="_beforeItemsRemove()"/>
    * <Controls.popup:Confirmation name="popupOpener"/>
    * </pre>
    * <pre class="brush: js">
    * class MyControl extends Control<IControlOptions> {
    *    _beforeItemsRemove(eventObject, idArray) {
    *       return this._children.popupOpener.open({
    *          message: 'Are you sure you want to delete the items?',
    *          type: 'yesno'
    *       });
    *    }
    * }
    * </pre>
    * @see afterItemsRemove
    * @see removeItems
    */
   /**
    * @event Controls/interface/IRemovable#afterItemsRemove Происходит после удаления элементов.
    * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
    * @param {Array.<String>|Array.<Number>} idArray Массив удаленных элементов.
    * @param {*} result Результат удаления элемента из источника данных.
    * @returns {Boolean} Если возвращен false, то при ошибке удаления не будет показано всплывающее окно.
    * @remark
    * По отображению дружелюбных ошибок при удалении записей подробнее читайте <a href="/doc/platform/developmentapl/interface-development/pattern-and-practice/handling-errors/handling-errors-base/#list-features">здесь</a>.
    * @see removeItems
    * @see beforeItemsRemove
    */
   /**
    * Удаляет элементы из источника данных по идентификаторам элементов коллекции.
    * @function Controls/interface/IRemovable#removeItems
    * @param {Array.<String>|Array.<Number>|Selection} items Массив элементов для удаления.
    * @see afterItemsRemove
    * @see beforeItemsRemove
    */
});
