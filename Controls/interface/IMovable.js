/* eslint-disable */
define('Controls/interface/IMovable', [], function () {
   /**
    * Интерфейс для перемещения элементов в коллекциях.
    *
    * @interface Controls/interface/IMovable
    * @public
    */
   /*
    * Interface for item moving in collections.
    *
    * @interface Controls/interface/IMovable
    * @public
    * @author Авраменко А.С.
    */
   /**
    * @typedef {String} MovePosition
    * @variant after Вставить перемещенные элементы после указанного элемента.
    * @variant before Вставить перемещенные элементы перед указанным элементом.
    * @variant on Вставить перемещенные элементы в указанный элемент.
    */
   /*
    * @typedef {String} MovePosition
    * @variant after Insert moved items after the specified item.
    * @variant before Insert moved items before the specified item.
    * @variant on Insert moved items into the specified item.
    */
   /**
    * @typedef {Object} Selection
    * @property {Array.<Number|String>} selected Массив выбранных ключей.
    * @property {Array.<Number|String>} excluded Массив исключенных из выборки ключей.
    */
   /*
    * @typedef {Object} Selection
    * @property {Array.<Number|String>} selected Array of selected keys.
    * @property {Array.<Number|String>} excluded Array of excluded keys.
    */
   /**
    * @typedef {String} Controls/interface/IMovable/BeforeItemsMoveResult
    * @variant Custom Ваша собственная логика перемещения предметов.
    * @variant MoveInItems Перемещение в списке без вызова из источника перемещения.
    */
   /*
    * @typedef {String} Controls/interface/IMovable/BeforeItemsMoveResult
    * @variant Custom Your own logic of moving items.
    * @variant MoveInItems Move in the list without calling move on source.
    */
   /**
    * @typedef {Object} IMoveDialogTemplateProp
    * @property {String} templateName Имя контрола, который будет отображаться в диалоговом окне выбора целевой записи для перемещения.
    * @property {Object} templateOptions Опции для контрола, который будет отображаться в диалоговом окне.
    */
   /*
    * @typedef {Object} IMoveDialogTemplateProp
    * @property {String} templateName Control name, that will be displayed in dialog for selecting the target record to move.
    * @property {Object} templateOptions Options for control, which is specified in the dialog for selecting the target record to move.
    */
   /**
    * @name Controls/interface/IMovable#moveDialogTemplate
    * @cfg {IMoveDialogTemplateProp|null} Шаблон {@link /doc/platform/developmentapl/interface-development/controls/list/actions/mover/#move-items-with-dialog диалогового окна} выбора целевой записи для перемещения.
    * Рекомендуется использовать стандартный шаблон {@link Controls/moverDialog:Template}.
    * @see moveItemsWithDialog
    * @see Controls/moverDialog:Template
    * @demo Controls-demo/treeGridNew/Mover/Base/Index
    */
   /**
    * @name Controls/interface/IMovable#sortingOrder
    * @cfg {String} Определяет, какая сортировка задана в dataSource.
    * @variant asc Сортировка по возрастанию.
    * @variant desc Сортировка по убыванию.
    * @default asc
    * @remark Эта опция необходима для указания порядка расположения данных в источнике, чтобы при изменении порядковых номеров элементы перемещались в правильное положение.
    */
   /**
    * @event Controls/interface/IMovable#beforeItemsMove Происходит до перемещения элементов.
    * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
    * @param {Array.<String>|Array.<Number>} movedItems Массив элементов перемещения.
    * @param {Types/entity:Record|String|Number} target Целевой элемент перемещения.
    * @param {MovePosition} position Положение перемещения.
    * @returns {Controls/interface/IMovable/BeforeItemsMoveResult.typedef}
    * @see afterItemsMove
    */
   /**
    * @event Controls/interface/IMovable#afterItemsMove Происходит после перемещения элементов.
    * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
    * @param {Array.<String>|Array.<Number>} movedItems Массив элементов перемещения.
    * @param {Types/entity:Record|String|Number} target Целевой элемент перемещения.
    * @param {MovePosition} position Положение перемещения.
    * @param {*} result Результат перемещения элементов.
    * @see beforeItemsMove
    */
   /**
    * Перемещает один элемент вверх.
    * @function Controls/interface/IMovable#moveItemUp
    * @param {String|Number} item Элемент перемещения.
    * @returns {Types/deferred:Deferred} Отложенный результат перемещения.
    * @see moveItemDown
    * @see moveItems
    */
   /**
    * Перемещает один элемент вниз.
    * @function Controls/interface/IMovable#moveItemDown
    * @param {String|Number} item Элемент перемещения.
    * @returns {Types/deferred:Deferred} Отложенный результат перемещения.
    * @see moveItemUp
    * @see moveItems
    */
   /**
    * Перемещает переданные элементы относительно указанного целевого элемента.
    * @function Controls/interface/IMovable#moveItems
    * @param {Array.<String>|Array.<Number>|Selection} movedItems Элементы для перемещения.
    * @param {String|Number} target Целевой элемент перемещения.
    * @param {MovePosition} position Положение перемещения.
    * @returns {Types/deferred:Deferred} Отложенный результат перемещения.
    * @remark
    * В зависимости от аргумента 'position' элементы могут быть перемещены до, после или на указанный целевой элемент.
    * @see moveItemUp
    * @see moveItemDown
    */
   /**
    * Перемещение переданных элементов с предварительным выбором родительского узла с помощью диалогового окна.
    * @function Controls/interface/IMovable#moveItemsWithDialog
    * @param {Array.<String>|Array.<Number>|Selection} movedItems Элементы для перемещения.
    * @param {Controls/_baseList/interface/IMovableList/IMoverDialogAdditionalConfig} config Дополнительная конфигурация окна перемещения
    * @remark
    * Компонент, указанный в опции {@link moveDialogTemplate moveDialogTemplate}, будет использоваться в качестве шаблона для диалога перемещения.
    * @see moveItemUp
    * @see moveItemDown
    * @see moveItems
    */
});
