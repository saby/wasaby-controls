/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
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
     * @cfg {Controls/_moverDialog/Template/IMoverDialogTemplateOptions} Опции для контрола, который будет отображаться в диалоговом окне.
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
 * Интерфейс параметров для открытия диалогового окна
 * @see Controls/_baseList/interface/IMovableList#moveDialogTemplate
 * @public
 */
export interface IListActionAdditionalConfig {
    /**
     * HTML элемент, относительно которого будет произведено открытие окна
     */
    target: HTMLElement;
    /**
     * Название команды для выполнения действия с RecordSet.
     */
    viewCommandName?: string;
    /**
     * Позволяет не использовать MoveToFolder  пока не все его добавили
     */
    useDefaultMoveMethod?: boolean;
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
     * @remark Чтобы скрыть или показать кнопку перемещения, можно возпользоваться утилитой {@link Controls/_listCommands/helpers/MoveHelpers/canMoveToDirection canMoveToDirection}
     */
    moveItemUp(selectedKey: CrudEntityKey, viewCommandName?: string): Promise<void>;

    /**
     * Перемещает выбранную запись на одну позицию вниз.
     * @demo Controls-demo/list_new/MoveController/Base/Index
     * @public
     * @param {Types/source:ICrud#CrudEntityKey} selectedKey
     * @param {String} viewCommandName Название команды для выполнения действия с RecordSet. По умолчанию Controls/viewCommands:Move
     * @remark Чтобы скрыть или показать кнопку перемещения, можно возпользоваться утилитой {@link Controls/_listCommands/helpers/MoveHelpers/canMoveToDirection canMoveToDirection}
     */
    moveItemDown(selectedKey: CrudEntityKey, viewCommandName?: string): Promise<void>;

    /**
     * Перемещает указанные элементы при помощи диалога MoveDialog, и возвращает результат moveItems().
     * @demo Controls-demo/treeGridNew/Mover/Base/Index
     * @public
     * @param {Controls/interface:ISelectionObject} selection
     * @param {IListActionAdditionalConfig} config Конфигурация, необходимая для открытия диалогового окна перемещения. В качестве команды для выполнения действия с RecordSet по умолчанию используется Controls/viewCommands:Move
     */
    moveItemsWithDialog(
        selection: ISelectionObject,
        config?: IListActionAdditionalConfig
    ): Promise<DataSet>;
}

/**
 * @name Controls/_baseList/interface/IMovableList#moveDialogTemplate
 * @cfg {Controls/list:IMoveDialogTemplate} Параметры диалогового окна выбора целевой записи для перемещения.
 * @example
 * <pre class="brush: js; highlight: [14-31, 34]">
 * import { View as ListView } from 'Controls/list';
 *
 * const _moverDataSource: Model = new Model({ ... });
 *
 * const _columns: IColumn[] = [ ... ];
 *
 * const _beforeMoveCallback = React.useCallback((
 *     selection: ISelectionObject,
 *     target: Model | CrudEntityKey
 * ) => {
 *     return Promise.resolve();
 * }, [])
 *
 * const moveDialogTemplate = {
 *     templateName: 'Controls/moverDialog:Template',
 *     beforeMoveCallback: _beforeMoveCallback,
 *     templateOptions: {
 *          root: null,
 *          rootVisible: true,
 *          rootTitle: 'Каталог',
 *          rootLabelVisible: false,
 *          keyProperty: 'key',
 *          parentProperty: 'parent',
 *          displayProperty: 'title',
 *          hasChildrenProperty: 'hasChild',
 *          searchParam: 'title',
 *          nodeProperty: 'type',
 *          source: _moverDataSource,
 *          columns: _columns,
 *     },
 * }
 *
 * return (
 *     <ListView storeId="ListStore"
 *               moveDialogTemplate={moveDialogTemplate} />
 * );
 * </pre>
 * @see IListActionAdditionalConfig
 * @see Controls/moverDialog:Template
 */
