import type { IAbstractListSliceState, IListChange, IListState } from 'Controls/dataFactory';
import type { Collection as ICollection } from 'Controls/display';
import type { CrudEntityKey } from 'Types/source';
import type { IRequestId, IRpcCommand, IStompEvent } from './IExternalTypes';
import type { IListMobileDataFactoryArguments } from './IListMobileDataFactoryArguments';
import type { SourceController } from '../_sourceController/SourceController';

export type IListMobileState = IAbstractListSliceState & IListState;

export type IListMobileMiddleware = (
    context: IListMobileMiddlewareContext
) => IListMobileMiddlewareWithContext;

export type IListMobileMiddlewareWithContext = (
    next: (action: IListMobileAction) => void
) => (action: IListMobileAction) => void;

export type IListMobileMiddlewareContext = {
    readonly collection: ICollection;
    readonly state: IListState;
    readonly initConfig: IListMobileDataFactoryArguments;
    readonly dispatch: (action: IListMobileAction) => void;
    readonly applyChanges: (changes: IListChange[]) => void;
    readonly sourceController: SourceController;
};

export enum IListMobileActionType {
    MARK,
    SELECT,
    CONNECT,
    DISCONNECT,
    SEND_COMMAND_STARTED,
    SEND_COMMAND_SUCCEEDED,
    SEND_COMMAND_FAILED,
    RECEIVE_EVENT_GROUP,
    OPEN_EVENT_CHANNEL_STARTED,
    OPEN_EVENT_CHANNEL_SUCCEEDED,
    OPEN_EVENT_CHANNEL_FAILED,
    CLOSE_EVENT_CHANNEL_STARTED,
    CLOSE_EVENT_CHANNEL_SUCCEEDED,
    CLOSE_EVENT_CHANNEL_FAILED,
    REGISTER_STATE_CHANGES,
    CHANGE_ROOT,
    EXPAND,
    COLLAPSE,
    NEXT,
    PREV,
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
          };
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
              command: IRpcCommand;
          };
      }
    | {
          type: IListMobileActionType.SEND_COMMAND_SUCCEEDED;
          payload: {
              command: IRpcCommand;
              response: unknown;
              requestId: IRequestId;
          };
      }
    | {
          type: IListMobileActionType.SEND_COMMAND_FAILED;
          payload: {
              command: IRpcCommand;
              error: Error;
          };
      }
    | {
          type: IListMobileActionType.RECEIVE_EVENT_GROUP;
          payload: {
              events: IStompEvent[];
              errors: Error[];
              requestId: IRequestId;
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
      };
