import type { TKey } from 'Controls-DataEnv/interface';
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';

/**
 * Тип действия, для загрузки предыдущей пачки данных.
 */
export type TLoadPrevAction = TAbstractAction<
    'loadPrev',
    {
        addItemsAfterLoad?: boolean;
        useServicePool?: boolean;
        onResolve?: Function;
        onReject?: Function;
        key?: TKey;
    }
>;

/**
 * Тип действия, для загрузки следующей пачки данных.
 */
export type TLoadNextAction = TAbstractAction<
    'loadNext',
    {
        addItemsAfterLoad?: boolean;
        useServicePool?: boolean;
        onResolve?: Function;
        onReject?: Function;
        key?: TKey;
    }
>;

/**
 * Тип действий для работы с источником данных, доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 */
export type TAnySourceAction = TLoadPrevAction | TLoadNextAction;
