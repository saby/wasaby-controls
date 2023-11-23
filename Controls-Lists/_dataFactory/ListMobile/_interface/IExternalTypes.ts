export type IRequestId = string | number | undefined;

export type IExternalItemWithIndex = {
    index: number;
    item: Record<string, unknown>;
};
export type IExternalIndexPair = {
    firstIndex: number;
    secondIndex: number;
};

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
              Ident: unknown[] | null;
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
    handleId: string;
    args: unknown;
    requestId: IRequestId;
};

export type IStompEventListener = (event: IAbstractStompEvent) => void;

export type IStompEventGroupListenerCallback = (params: {
    events: IStompEvent[];
    errors: Error[];
    requestId: IRequestId;
}) => void;

export type IStompEvent = IAbstractStompEvent &
    (
        | {
              type: IStompEventType.OnAdd;
              args: [IExternalItemWithIndex[]];
          }
        | {
              type: IStompEventType.OnRemove;
              args: [number[]];
          }
        | {
              type: IStompEventType.OnReplace;
              args: [IExternalItemWithIndex[]];
          }
        | {
              type: IStompEventType.OnMove;
              args: [IExternalIndexPair[]];
          }
        | {
              type: IStompEventType.OnReset;
              args: [Record<string, unknown>[]];
          }
        | {
              type: IStompEventType.OnAddThrobber;
              args: [IExternalPosition];
          }
        | {
              type: IStompEventType.OnRemoveThrobber;
              args: [];
          }
        | {
              type: IStompEventType.OnAddStub;
              args: [IExternalStubType, IExternalPosition];
          }
        | {
              type: IStompEventType.OnRemoveStub;
              args: [];
          }
        | {
              type: IStompEventType.Begin;
              args: [];
          }
        | {
              type: IStompEventType.End;
              args: [];
          }
        | {
              type: IStompEventType.OnMark;
              args: [IExternalMark];
          }
        | {
              type: IStompEventType.OnSelect;
              args: [IExternalSelect[]];
          }
        | {
              type: IStompEventType.OnPath;
              args: [Record<string, unknown>[]];
          }
    );
