/**
 * @kaizen_zone 1ae44c37-18d9-4109-b22c-bd35470364aa
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { DataSet, CrudEntityKey, LOCAL_MOVE_POSITION } from 'Types/source';
import { ISelectionObject } from 'Controls/interface';
import { IMoverDialogTemplateOptions } from 'Controls/moverDialog';
import { Model } from 'Types/entity';
import { IHashMap } from 'Types/declarations';

export type TFilterObject = IHashMap<any>;

/**
 * @typedef {Function} TBeforeMoveCallback
 * @description Функция обратного вызова, вызываемая до перемещения в источнике
 * @param {Controls/interfaces:ISelectionObject} selection
 * @param {Types/entity:Model|Types/source:ICrud#CrudEntityKey} target
 */
export type TBeforeMoveCallback = (
    selection: ISelectionObject,
    target: Model | CrudEntityKey,
    filter: TFilterObject
) => boolean | Promise<void>;

/**
 * Интерфейс настройки {@link /doc/platform/developmentapl/interface-development/controls/list/actions/mover/#move-items-with-dialog диалогового окна} выбора целевой записи для перемещения.
 * @interface Controls/_baseList/interface/IMovableList/IMoveDialogTemplate
 * @public
 */
export interface IMoveDialogTemplate {
    /**
     * @cfg {UI/Base:Control<IControlOptions, unknown> | UI/Base:TemplateFunction | String} Имя контрола, который будет отображаться в диалоговом окне выбора целевой записи, для перемещения.
     */
    templateName: Control<IControlOptions, unknown> | TemplateFunction | string;
    /**
     * @cfg {Controls/moverDialog:IMoverDialogTemplateOptions} Опции для контрола, который будет отображаться в диалоговом окне.
     */
    templateOptions: IMoverDialogTemplateOptions;
    /**
     * @cfg {TBeforeMoveCallback} Функция обратного вызова, вызываемая до перемещения в источнике\
     * @remark
     * Если перемещение необходимо прервать после выбора папки в диалоге, то эта функция должна вернуть false или Promise.reject()
     */
    beforeMoveCallback?: TBeforeMoveCallback;
}

export interface IMovableOptions {
    moveDialogTemplate?: IMoveDialogTemplate;
}

/**
 * Интерфейс контрола View, который обладает возможностью перемещения записей.
 * @public
 */
export interface IMovableList {
    /**
     * Перемещает указанные записи в указанную позицию position, которая может принимать значения after/before/on.
     * @demo Controls-demo/ListCommands/Move/DragNDrop/Index
     * @public
     * @param {Controls/interface:ISelectionObject} selection
     * @param {Types/source:ICrud#CrudEntityKey} targetKey
     * @param {Types/source/LOCAL_MOVE_POSITION.typedef} position
     * @param {String} viewCommandName Название команды для выполнения действия с RecordSet. По умолчанию Controls/viewCommands:Move
     */
    moveItems(
        selection: ISelectionObject,
        targetKey: CrudEntityKey,
        position: LOCAL_MOVE_POSITION,
        viewCommandName?: string
    ): Promise<DataSet>;

    /**
     * Перемещает выбранную запись на одну позицию вверх.
     * @demo Controls-demo/list_new/MoveController/Base/Index
     * @public
     * @param {Types/source:ICrud#CrudEntityKey} selectedKey
     * @param {String} viewCommandName Название команды для выполнения действия с RecordSet. По умолчанию Controls/viewCommands:Move
     * @remark Чтобы скрыть или показать кнопку перемещения, можно возпользоваться утилитой {@link Controls/_baseList/resources/utils/MoveHelpers/canMoveToDirection canMoveToDirection}
     */
    moveItemUp(selectedKey: CrudEntityKey, viewCommandName?: string): Promise<void>;

    /**
     * Перемещает выбранную запись на одну позицию вниз.
     * @demo Controls-demo/list_new/MoveController/Base/Index
     * @public
     * @param {Types/source:ICrud#CrudEntityKey} selectedKey
     * @param {String} viewCommandName Название команды для выполнения действия с RecordSet. По умолчанию Controls/viewCommands:Move
     * @remark Чтобы скрыть или показать кнопку перемещения, можно возпользоваться утилитой {@link Controls/_baseList/resources/utils/MoveHelpers/canMoveToDirection canMoveToDirection}
     */
    moveItemDown(selectedKey: CrudEntityKey, viewCommandName?: string): Promise<void>;

    /**
     * Перемещает указанные элементы при помощи диалога MoveDialog, и возвращает результат moveItems().
     * @demo Controls-demo/treeGridNew/Mover/Base/Index
     * @public
     * @param {Controls/interface:ISelectionObject} selection
     * @param {String} viewCommandName Название команды для выполнения действия с RecordSet. По умолчанию Controls/viewCommands:Move
     */
    moveItemsWithDialog(selection: ISelectionObject, viewCommandName?: string): Promise<DataSet>;
}

/**
 * @name Controls/_baseList/interface/IMovableList#moveDialogTemplate
 * @cfg {Controls/list:IMoveDialogTemplate} Параметры диалогового окна выбора целевой записи для перемещения.
 * @example
 * <pre class="brush: html; highlight: [6-10]">
 * <!-- WML -->
 * <Controls.list:View
 *      name="list"
 *      source="{{ _viewSource }}"
 *      multiSelectVisibility="visible">
 *      <ws:moveDialogTemplate templateName="Controls/moverDialog:Template">
 *          <ws:templateOptions
 *              root="{{null}}"
 *              rootVisible="{{true}}"
 *              rootTitle="Каталог"
 *              rootLabelVisible="{{false}}"
 *              keyProperty="key"
 *              parentProperty="parent"
 *              displayProperty="title"
 *              hasChildrenProperty="hasChild"
 *              searchParam="title"
 *              nodeProperty="type"
 *              source="{{_moverDataSource}}"
 *              columns="{{_columns}}"
 *              beforeMoveCallback="{{_beforeMoveCallback}}"/>
 *      </ws:moveDialogTemplate>
 *  </Controls.list:View>
 * </pre>
 * @see Controls/moverDialog:Template
 */
