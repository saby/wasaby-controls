import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';

/**
 * Тип действия для установки видимости заглушки.
 */
export type TSetStubVisibilityAction = TAbstractAction<
    'setStubVisibility',
    {
        needShowStub: boolean;
    }
>;
/**
 * Тип действий функционала "Работа с заглушкой", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 */
export type TAnyStubAction = TSetStubVisibilityAction;
