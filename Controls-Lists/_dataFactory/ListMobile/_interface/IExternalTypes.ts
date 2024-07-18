import type { CrudEntityKey } from 'Types/source';
import type { Record as SbisRecord } from 'Types/entity';
import type { RecordSet } from 'Types/collection';

export type IRequestId = string | number | undefined;

export const BREADCRUMBS_DISPLAY_PROPERTY = 'title';

export enum CollectionItemModule {
    Data = 'Data',
    HasMoreFooter = 'HasMoreFooter',
}

const L = ([str]: TemplateStringsArray) => `CollectionItemKey<${str}>`;

export const ExternalCollectionItemKeys = {
    ident: L`ident`,
    parent: L`parent`,
    node_type: L`node_type`,
    is_marked: L`is_marked`,
    is_selected: L`is_selected`,
    is_expanded: L`is_expanded`,
    module: L`module`,
    origin: 'origin',
    stub: 'stub',
};

export type IExternalCollectionItem = {
    ident: string | null;
    parent: string | null;
    node_type: boolean;
    is_marked: boolean;
    is_selected: boolean;
    is_expanded: boolean;
    origin: SbisRecord | null;
    stub: SbisRecord<{
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

export enum IExternalPosition {
    IN_PLACE,
    HEADER,
}

export enum IExternalStubType {
    // нет данных по дефолтному фильтру
    NO_DATA_STUB,
    // нет данных по недефолтному фильтру
    BAD_FILTER_STUB,
    // нет сети
    NO_NETWORK_STUB,
    // проблемы с сервером
    SERVER_TROUBLE,
}

export enum IExternalSelectStatus {
    SET,
    UNSET,
    ACTIVE,
}

export type IExternalMark = {
    // снять маркер с этой позиции
    disable?: number;
    // поставить маркер в эту позицию
    enable?: number;
};

export type IExternalSelect = {
    // позиция элемента
    pos: number;
    // статус выбора у позиции
    status: IExternalSelectStatus;
};

export enum IExternalDirection {
    FORWARD,
    BACKWARD,
}

export enum IRpcCommandMethod {
    GET = 'Get',
    NEXT = 'Next',
    PREV = 'Prev',
    DISPOSE = 'Dispose',
    GET_CRUD = 'GetCrud',
    MARK = 'Mark',
    KEEP_ALIVE = 'ConfirmDjinniPageAlive',
    SELECT = 'Select',
    SELECT_ALL = 'SelectAll',
    RESET_SELECTION = 'ResetSelection',
    INVERT_SELECTION = 'InvertSelection',
    EXPAND = 'Expand',
    COLLAPSE = 'Collapse',
    GET_SELECTION = 'GetSelection',
    CHANGE_ROOT = 'ChangeRoot',
    SET_OBSERVER = 'SetObserver',
    REFRESH = 'Refresh',
}

export type IRpcCommand =
    | {
          method: IRpcCommandMethod.GET;
          params: {
              Filter: Record<string, unknown>;
              Pagination: {
                  pagination: [
                      {
                          pagination: {
                              direction: IExternalDirection;
                              page_size: number;
                          };
                          ident?: unknown[];
                      }
                  ];
              };
          };
      }
    | {
          method: IRpcCommandMethod.SET_OBSERVER;
          params: {
              Handle: string;
              ObserverId: string;
          };
      }
    | {
          method: IRpcCommandMethod.KEEP_ALIVE;
          params: {
              page_id: string;
          };
      }
    | {
          method: IRpcCommandMethod.NEXT;
          params: {
              Handle: string;
              AnchorIndex: number;
          };
      }
    | {
          method: IRpcCommandMethod.PREV;
          params: {
              Handle: string;
              AnchorIndex: number;
          };
      }
    | {
          method: IRpcCommandMethod.REFRESH;
          params: {
              Handle: string;
          };
      }
    | {
          method: IRpcCommandMethod.DISPOSE;
          params: {
              Handle: string;
          };
      }
    | {
          method: IRpcCommandMethod.GET_CRUD;
          params: {
              Handle: string;
          };
      }
    | {
          method: IRpcCommandMethod.MARK;
          params: {
              Handle: string;
              Pos: number;
          };
      }
    | {
          method: IRpcCommandMethod.SELECT;
          params: {
              Handle: string;
              Pos: number;
          };
      }
    | {
          method: IRpcCommandMethod.SELECT_ALL;
          params: {
              Handle: string;
          };
      }
    | {
          method: IRpcCommandMethod.RESET_SELECTION;
          params: {
              Handle: string;
          };
      }
    | {
          method: IRpcCommandMethod.INVERT_SELECTION;
          params: {
              Handle: string;
          };
      }
    | {
          method: IRpcCommandMethod.EXPAND;
          params: {
              Handle: string;
              Pos: number;
          };
      }
    | {
          method: IRpcCommandMethod.COLLAPSE;
          params: {
              Handle: string;
              Pos: number;
          };
      }
    | {
          method: IRpcCommandMethod.GET_SELECTION;
          params: {
              Handle: string;
          };
      }
    | {
          method: IRpcCommandMethod.CHANGE_ROOT;
          params: {
              Handle: string;
              Ident: CrudEntityKey | null;
          };
      };

export enum IStompEventType {
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
              type: IStompEventType.OnAdd;
              args: RecordSet<{ index: number; item: SbisRecord<IExternalCollectionItem> }>;
          }
        | {
              type: IStompEventType.OnRemove;
              args: RecordSet<{ index: number }>;
          }
        | {
              type: IStompEventType.OnReplace;
              args: RecordSet<{ index: number; item: SbisRecord<IExternalCollectionItem> }>;
          }
        | {
              type: IStompEventType.OnReset;
              args: RecordSet<IExternalCollectionItem>;
          }
        | {
              type: IStompEventType.OnMark;
              args: SbisRecord<{ disable: number; enable: number }>;
          }
        | {
              type: IStompEventType.OnSelect;
              args: RecordSet<{ pos: number; selection_status: IExternalSelectStatus }>;
          }
        | {
              type: IStompEventType.OnPath;
              args: RecordSet<IExternalCollectionItem>;
          }
        | {
              type: IStompEventType.End;
              args: RecordSet<{ ident: string | null; forward: boolean; backward: boolean }>;
          }
        | {
              type: IStompEventType.OnMove;
              args: RecordSet;
          }
        | {
              type: IStompEventType.OnAddThrobber;
              args: RecordSet;
          }
        | {
              type: IStompEventType.OnRemoveThrobber;
              args: RecordSet;
          }
        | {
              type: IStompEventType.OnAddStub;
              args: RecordSet;
          }
        | {
              type: IStompEventType.OnRemoveStub;
              args: RecordSet;
          }
        | {
              type: IStompEventType.Begin;
              args: RecordSet;
          }
    );

export type IStompEventByType<
    TType extends IStompEventType,
    T extends IStompEvent = IStompEvent
> = T extends {
    type: TType;
    args: infer R;
}
    ? { type: TType; args: R }
    : never;
