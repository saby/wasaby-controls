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
 * Тип действий функционала "Работа с заглушкой", доступные в WEB списке.
 */
export type TAnyStubAction = TSetStubVisibilityAction;
