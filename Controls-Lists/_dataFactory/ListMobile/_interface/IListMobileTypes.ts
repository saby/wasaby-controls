/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IAbstractListSliceState, IListState } from 'Controls/dataFactory';
import type { IListChange } from 'Controls/listAspects';
import type { Collection as ICollection } from 'Controls/display';
import type { CrudEntityKey } from 'Types/source';
import type { MarkerDirection, TFilter } from 'Controls/interface';
import type { IRequestId, TRpcCommand, TUIEvent } from './IExternalTypes';
import type { IListMobileDataFactoryArguments } from './IListMobileDataFactoryArguments';
import type { SourceController } from '../_sourceController/SourceController';
import type { VirtualCollection } from '../_virtualCollection/VirtualCollection';

/**
 * Интерфейс состояния мобильного слайса.
 * @interface Controls-Lists/_dataFactory/ListMobile/_interface/IListMobileTypes/IListMobileState
 * @public
 */
export type IListMobileState = IAbstractListSliceState & IListState;

export type IListMobileMiddleware = (
    context: IListMobileMiddlewareContext
) => IListMobileMiddlewareWithContext;

export type IListMobileMiddlewareWithContext = (
    next: (action: IListMobileAction) => void
) => (action: IListMobileAction) => void;

export type IListMobileMiddlewareContext = {
    readonly collection: ICollection;
    readonly virtualCollection: VirtualCollection;
    readonly state: IListState;
    readonly initConfig: IListMobileDataFactoryArguments;
    readonly dispatch: (action: IListMobileAction) => void;
    readonly applyChanges: (changes: IListChange[]) => void;
    readonly sourceController: SourceController;
};

export enum IListMobileActionType {
    MARK = 'MARK',
    SELECT = 'SELECT',
    SELECT_ALL = 'SELECT_ALL',
    INVERT_SELECTION = 'INVERT_SELECTION',
    RESET_SELECTION = 'RESET_SELECTION',
    CONNECT = 'CONNECT',
    DISCONNECT = 'DISCONNECT',
    SEND_COMMAND_STARTED = 'SEND_COMMAND_STARTED',
    SEND_COMMAND_SUCCEEDED = 'SEND_COMMAND_SUCCEEDED',
    SEND_COMMAND_FAILED = 'SEND_COMMAND_FAILED',
    RECEIVE_EVENT = 'RECEIVE_EVENT',
    OPEN_EVENT_CHANNEL_STARTED = 'OPEN_EVENT_CHANNEL_STARTED',
    OPEN_EVENT_CHANNEL_SUCCEEDED = 'OPEN_EVENT_CHANNEL_SUCCEEDED',
    OPEN_EVENT_CHANNEL_FAILED = 'OPEN_EVENT_CHANNEL_FAILED',
    CLOSE_EVENT_CHANNEL_STARTED = 'CLOSE_EVENT_CHANNEL_STARTED',
    CLOSE_EVENT_CHANNEL_SUCCEEDED = 'CLOSE_EVENT_CHANNEL_SUCCEEDED',
    CLOSE_EVENT_CHANNEL_FAILED = 'CLOSE_EVENT_CHANNEL_FAILED',
    REGISTER_STATE_CHANGES = 'REGISTER_STATE_CHANGES',
    CHANGE_ROOT = 'CHANGE_ROOT',
    EXPAND = 'EXPAND',
    COLLAPSE = 'COLLAPSE',
    NEXT = 'NEXT',
    PREV = 'PREV',
    CHANGE_UI_COLLECTION_ROOT = 'CHANGE_UI_COLLECTION_ROOT',
    OPEN_OPERATIONS_PANEL = 'OPEN_OPERATIONS_PANEL',
    CLOSE_OPERATIONS_PANEL = 'CLOSE_OPERATIONS_PANEL',
    SEARCH = 'SEARCH',
    RESET_SEARCH = 'RESET_SEARCH',
    SET_FILTER = 'SET_FILTER',
}

export type IListMobileAction =
    | {
          type: IListMobileActionType.MARK;
          payload: {
              key: CrudEntityKey;
          };
      }
    | {
          type: IListMobileActionType.SELECT;
          payload: {
              key: CrudEntityKey;
              direction?: MarkerDirection;
          };
      }
    | {
          type: IListMobileActionType.SELECT_ALL;
          payload: {};
      }
    | {
          type: IListMobileActionType.INVERT_SELECTION;
          payload: {};
      }
    | {
          type: IListMobileActionType.RESET_SELECTION;
          payload: {};
      }
    | {
          type: IListMobileActionType.CONNECT;
          payload: {};
      }
    | {
          type: IListMobileActionType.DISCONNECT;
          payload: {};
      }
    | {
          type: IListMobileActionType.SEND_COMMAND_STARTED;
          payload: {
              command: TRpcCommand;
          };
      }
    | {
          type: IListMobileActionType.SEND_COMMAND_SUCCEEDED;
          payload: {
              command: TRpcCommand;
              response: unknown;
              requestId: IRequestId;
          };
      }
    | {
          type: IListMobileActionType.SEND_COMMAND_FAILED;
          payload: {
              command: TRpcCommand;
              error: Error;
          };
      }
    | {
          type: IListMobileActionType.RECEIVE_EVENT;
          payload: {
              event: TUIEvent;
          };
      }
    | {
          type: IListMobileActionType.OPEN_EVENT_CHANNEL_STARTED;
          payload: {};
      }
    | {
          type: IListMobileActionType.OPEN_EVENT_CHANNEL_SUCCEEDED;
          payload: {};
      }
    | {
          type: IListMobileActionType.OPEN_EVENT_CHANNEL_FAILED;
          payload: {
              error: Error;
          };
      }
    | {
          type: IListMobileActionType.CLOSE_EVENT_CHANNEL_STARTED;
          payload: {};
      }
    | {
          type: IListMobileActionType.CLOSE_EVENT_CHANNEL_SUCCEEDED;
          payload: {};
      }
    | {
          type: IListMobileActionType.CLOSE_EVENT_CHANNEL_FAILED;
          payload: {
              error: Error;
          };
      }
    | {
          type: IListMobileActionType.REGISTER_STATE_CHANGES;
          payload: {
              changes: IListChange[];
          };
      }
    | {
          type: IListMobileActionType.CHANGE_ROOT;
          payload: {
              root: CrudEntityKey | null;
          };
      }
    | {
          type: IListMobileActionType.EXPAND;
          payload: {
              key: CrudEntityKey;
          };
      }
    | {
          type: IListMobileActionType.COLLAPSE;
          payload: {
              key: CrudEntityKey;
          };
      }
    | {
          type: IListMobileActionType.NEXT;
          payload: {
              key: CrudEntityKey;
          };
      }
    | {
          type: IListMobileActionType.PREV;
          payload: {
              key: CrudEntityKey;
          };
      }
    | {
          type: IListMobileActionType.CHANGE_UI_COLLECTION_ROOT;
          payload: {
              key: CrudEntityKey | null;
          };
      }
    | {
          type: IListMobileActionType.OPEN_OPERATIONS_PANEL;
          payload: {};
      }
    | {
          type: IListMobileActionType.CLOSE_OPERATIONS_PANEL;
          payload: {};
      }
    | {
          type: IListMobileActionType.SEARCH;
          payload: { searchValue: string };
      }
    | {
          type: IListMobileActionType.RESET_SEARCH;
          payload: {};
      }
    | {
          type: IListMobileActionType.SET_FILTER;
          payload: {
              filter: TFilter;
          };
      };
