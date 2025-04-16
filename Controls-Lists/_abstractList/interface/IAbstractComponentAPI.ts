import type { CrudEntityKey } from 'Types/source';
import type { ScrollControllerLib } from 'Controls/listsCommonLogic';

export interface IAbstractListScrollAPI {
    scrollToItem(key: CrudEntityKey, position?: ScrollControllerLib.TScrollToPosition): void;
}

export interface IAbstractComponentAPI extends IAbstractListScrollAPI {}
