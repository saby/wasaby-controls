import type { CrudEntityKey } from 'Types/source';
import type { Record as SbisRecord } from 'Types/entity';
import type { RecordSet } from 'Types/collection';
import type { TKey } from 'Controls/interface';

export type IRequestId = string | number | undefined;

export const BREADCRUMBS_DISPLAY_PROPERTY = 'title';

export enum CollectionItemModule {
    Data = 'Data',
    HasMoreFooter = 'HasMoreFooter',
}

const L = ([str]: TemplateStringsArray) => `CollectionItemKey<${str}>`;

export enum CollectionItemKeys {
    ident = 'ident',
    parent = 'parent',
    node_type = 'node_type',
    is_marked = 'is_marked',
    is_selected = 'is_selected',
    is_expanded = 'is_expanded',
    level = 'level',
    sub_level = 'sub_level',
    origin = 'origin',
    stub = 'stub',
}

export const CollectionItemFormat = [
    {
        name: 'ident',
        type: 'string',
    },
    {
        name: 'parent',
        type: 'string',
    },
    {
        name: 'node_type',
        type: 'boolean',
    },
    {
        name: 'is_marked',
        type: 'boolean',
    },
    {
        name: 'is_selected',
        type: 'integer',
    },
    {
        name: 'is_expanded',
        type: 'boolean',
    },
    {
        name: 'level',
        type: 'integer',
    },
    {
        name: 'sub_level',
        type: 'boolean',
    },
    {
        name: 'origin',
        type: 'record',
    },
    {
        name: 'stub',
        type: 'record',
    },
] as const;

export const ExternalCollectionItemKeys = {
    ident: L`ident`,
    parent: L`parent`,
    node_type: L`node_type`,
    is_marked: L`is_marked`,
    is_selected: L`is_selected`,
    is_expanded: L`is_expanded`,
    level: L`level`,
    sub_level: L`sub_level`,
    module: L`module`,
    origin: 'origin',
    stub: 'stub',
};

export type IExternalCollectionItem = {
    [CollectionItemKeys.ident]: string | null;
    [CollectionItemKeys.parent]: string | null;
    [CollectionItemKeys.node_type]: boolean;
    [CollectionItemKeys.is_marked]: boolean;
    [CollectionItemKeys.is_selected]: number;
    [CollectionItemKeys.is_expanded]: boolean;
    [CollectionItemKeys.level]: number;
    [CollectionItemKeys.sub_level]: boolean;
    [CollectionItemKeys.origin]: SbisRecord | null;
    [CollectionItemKeys.stub]: SbisRecord<{
        pos: number;
    }> | null;
};

export type IExternalDecoratedModel = {
    'CollectionItemKey<ident>': string | null;
    'CollectionItemKey<parent>': string | null;
    'CollectionItemKey<node_type>': boolean;
    'CollectionItemKey<is_marked>': boolean;
    'CollectionItemKey<is_selected>': boolean;
    'CollectionItemKey<is_expanded>': boolean;
    'CollectionItemKey<module>': CollectionItemModule;
} & Record<string, unknown>;

/**
 * @enum
 * Варианты значений, которые могут находиться в CollectionItemKey<is_selected> модели строки.
 * В таком виде приходят с сервера
 * Если на клиенте необходимо переименовать значения перечисления(для удобной отладки или API без перечислений),
 * то необходимо создать новое перечисление, обеспечить карту соответствий между ними и использовать новый только на UI.
 * @private
 */
export enum ExternalSelectStatus {
    /**
     * Не выбрано
     */
    UNSET = 1,
    /**
     * Выбрано полностью
     */
    SET = 0,
    /**
     * Выбрано частично
     */
    ACTIVE = 2,
}

export enum ExternalDirection {
    FORWARD,
    BACKWARD,
}

/**
 * Имена доступных серверных команд.
 * @enum
 * @private
 */
export enum RpcCommandMethod {
    /**
     * Имя метода для получения коллекции
     */
    GET = 'Get',
    SET_OBSERVER = 'SetObserver',
    DISPOSE = 'Dispose',
    REFRESH = 'Refresh',
    KEEP_ALIVE = 'ConfirmDjinniPageAlive',
    /**
     * Имя метода для загрузки следующей пачки данных
     */
    NEXT = 'Next',
    /**
     * Имя метода для загрузки предыдущей пачки данных
     */
    PREV = 'Prev',
    /**
     * Имя метода для отметки записи маркером
     */
    MARK = 'Mark',
    /**
     * Имя метода для выбора одной записи
     */
    SELECT = 'Select',
    /**
     * Имя метода для выбора всех записей
     */
    SELECT_ALL = 'SelectAll',
    /**
     * Имя метода для сброса выделенных записей
     */
    RESET_SELECTION = 'ResetSelection',
    /**
     * Имя метода для инвертирования выделения записей
     */
    INVERT_SELECTION = 'InvertSelection',
    /**
     * Имя метода для получения состояния выделения всех записей
     */
    GET_SELECTION = 'GetSelection',
    /**
     * Имя метода для разворота узла и загрузки следующей пачки в узле
     */
    EXPAND = 'Expand',
    /**
     * Имя метода для сворачивания узла
     */
    COLLAPSE = 'Collapse',
    /**
     * Имя метода для смены текущего корня
     */
    CHANGE_ROOT = 'ChangeRoot',

    GET_CRUD = 'GetCrud',
}

/**
 * Интерфейс абстрактной серверной команды.
 * Все серверные команды, кроме утилитарных, обязаны в параметрах передавать параметр Handle.
 * Handle - идентификатор сеанса работы с серверной коллекцией.
 */
// TODO: Запретить передавать Handle
interface IAbstractRpcCommand<
    TMethod extends RpcCommandMethod,
    TParams extends Record<keyof any, unknown> = {}
> {
    /**
     * Имя серверной команды
     */
    method: TMethod;

    /**
     * Параметры для серверной команды
     */
    params: TParams &
        (TMethod extends
            | RpcCommandMethod.GET
            | RpcCommandMethod.SET_OBSERVER
            | RpcCommandMethod.KEEP_ALIVE
            ? {}
            : {
                  /**
                   * Идентификатор сеанса работы с серверной коллекцией
                   */
                  Handle: string;
              });
}

/**
 * Доступные серверные команды.
 * @private
 */
export type TRpcCommand =
    | IAbstractRpcCommand<
          RpcCommandMethod.GET,
          {
              Filter: SbisRecord<Record<string, unknown>>;
              Pagination: SbisRecord<{
                  pagination: RecordSet<
                      SbisRecord<{
                          pagination: SbisRecord<{
                              direction: ExternalDirection;
                              page_size: number;
                          }>;
                          ident?: TKey;
                      }>
                  >;
              }>;
              page_id: string;
          }
      >
    | IAbstractRpcCommand<
          RpcCommandMethod.SET_OBSERVER,
          {
              ObserverId: string;
          }
      >
    | IAbstractRpcCommand<RpcCommandMethod.REFRESH>
    | IAbstractRpcCommand<
          RpcCommandMethod.DISPOSE,
          {
              Handle: string;
              page_id: string;
          }
      >
    | IAbstractRpcCommand<
          RpcCommandMethod.KEEP_ALIVE,
          {
              page_id: string;
          }
      >
    | IAbstractRpcCommand<
          RpcCommandMethod.NEXT,
          {
              Handle: string;
              AnchorIndex: number;
          }
      >
    | IAbstractRpcCommand<
          RpcCommandMethod.PREV,
          {
              AnchorIndex: number;
          }
      >
    | IAbstractRpcCommand<RpcCommandMethod.GET_CRUD>
    | IAbstractRpcCommand<
          RpcCommandMethod.MARK,
          {
              Pos: number;
          }
      >
    | IAbstractRpcCommand<
          RpcCommandMethod.SELECT,
          {
              Pos: number;
              Direction?: ExternalDirection;
          }
      >
    | IAbstractRpcCommand<RpcCommandMethod.SELECT_ALL>
    | IAbstractRpcCommand<RpcCommandMethod.RESET_SELECTION>
    | IAbstractRpcCommand<RpcCommandMethod.INVERT_SELECTION>
    | IAbstractRpcCommand<RpcCommandMethod.GET_SELECTION>
    | IAbstractRpcCommand<
          RpcCommandMethod.EXPAND,
          {
              Pos: number;
          }
      >
    | IAbstractRpcCommand<
          RpcCommandMethod.COLLAPSE,
          {
              Pos: number;
          }
      >
    | IAbstractRpcCommand<
          RpcCommandMethod.CHANGE_ROOT,
          {
              Ident: CrudEntityKey | null;
          }
      >;

/**
 * Утилитарный тип, позволяющий получить тип Rpc команды по ее имени.
 * @example
 * const a: TRpcCommandByMethod<RpcCommandMethod.GET_SELECTION> = {
 *      method: RpcCommandMethod.GET_SELECTION,
 *      params: {
 *          Handle: 'xxx-xxx'
 *      }
 * }
 * @see RpcCommandMethod
 * @private
 */
export type TRpcCommandByMethod<
    TMethod extends RpcCommandMethod,
    T extends TRpcCommand = TRpcCommand
> = T extends {
    method: TMethod;
    params: infer R;
}
    ? { method: TMethod; params: R }
    : never;

export enum StompEventType {
    /**
     * Добавить в коллекцию элементы по индексам.
     */
    OnAdd = 'h_collection_observer.on_add',
    /**
     * Удалить элементы из коллекции по индексу.
     */
    OnRemove = 'h_collection_observer.on_remove',
    /**
     * Заменить в коллекции элемент по индексу
     */
    OnReplace = 'h_collection_observer.on_replace',
    /**
     * Поменять местами элементы по парам индексов.
     */
    OnMove = 'h_collection_observer.on_move',
    /**
     * Коллекция должна быть сброшена, обновлены все записи.
     */
    OnReset = 'h_collection_observer.on_reset',
    /**
     * Показать крутилку
     */
    OnAddThrobber = 'h_collection_observer.on_add_throbber',
    /**
     * Скрыть крутилку
     */
    OnRemoveThrobber = 'h_collection_observer.on_remove_throbber',
    /**
     * Показать заглушку
     */
    OnAddStub = 'h_collection_observer.on_add_stub',
    /**
     * Скрыть заглушку
     */
    OnRemoveStub = 'h_collection_observer.on_remove_stub',
    /**
     * Начать сеанс обновления коллекцию.
     */
    Begin = 'h_collection_observer.on_begin_update',
    /**
     * Закончить сеанс обновления коллекции.
     */
    End = 'h_collection_observer.on_end_update',
    /**
     * Установить маркер.
     */
    OnMark = 'h_collection_observer.on_mark',
    /**
     * Установить выделение.
     */
    OnSelect = 'h_collection_observer.on_select',
    /**
     * Установить путь.
     */
    OnPath = 'h_collection_observer.on_path',
}

export type IAbstractStompEvent = {
    type: string;
    observerId: string;
    args: unknown;
    requestId: IRequestId;
};

export type IStompEventListener = (event: IAbstractStompEvent) => void;
export type IStompEventGroupListener = (
    _: unknown,
    {
        events,
        errors,
        requestId,
    }: {
        events: IStompEvent[];
        errors: Error[];
        requestId: IRequestId;
    }
) => void;

export type IStompEventGroupListenerCallback = (params: {
    events: IStompEvent[];
    errors: Error[];
    requestId: IRequestId;
}) => void;

export type IStompEvent = IAbstractStompEvent &
    (
        | {
              type: StompEventType.OnAdd;
              args: RecordSet<
                  SbisRecord<{ index: number; item: SbisRecord<IExternalCollectionItem> }>
              >;
          }
        | {
              type: StompEventType.OnRemove;
              args: RecordSet<{ index: number }>;
          }
        | {
              type: StompEventType.OnReplace;
              args: RecordSet<{ index: number; item: SbisRecord<IExternalCollectionItem> }>;
          }
        | {
              type: StompEventType.OnReset;
              args: RecordSet<IExternalCollectionItem>;
          }
        | {
              type: StompEventType.OnMark;
              args: SbisRecord<{ disable: number; enable: number }>;
          }
        | {
              type: StompEventType.OnSelect;
              args: RecordSet<{ pos: number; selection_status: ExternalSelectStatus }>;
          }
        | {
              type: StompEventType.OnPath;
              args: RecordSet<IExternalCollectionItem>;
          }
        | {
              type: StompEventType.End;
              args: RecordSet<{ ident: string | null; forward: boolean; backward: boolean }>;
          }
        | {
              type: StompEventType.OnMove;
              args: RecordSet;
          }
        | {
              type: StompEventType.OnAddThrobber;
              args: RecordSet;
          }
        | {
              type: StompEventType.OnRemoveThrobber;
              args: RecordSet;
          }
        | {
              type: StompEventType.OnAddStub;
              args: SbisRecord<{ stub_type: number; position: number }>;
          }
        | {
              type: StompEventType.OnRemoveStub;
              args: SbisRecord<{ stub_type: number; position: number }>;
          }
        | {
              type: StompEventType.Begin;
              args: RecordSet;
          }
    );

export type IStompEventByType<
    TType extends StompEventType,
    T extends IStompEvent = IStompEvent
> = T extends {
    type: TType;
    args: infer R;
}
    ? { type: TType; args: R }
    : never;
