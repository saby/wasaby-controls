import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';

/**
 * Тип действия для обновления модели, описывающей операции над записями.
 */
export type TUpdateItemActionsMapAction = TAbstractAction<'updateItemActionsMap', {}>;

/**
 * Тип действий функционала "Работа с действиями над записью", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 */
export type TAnyItemActionsAction = TUpdateItemActionsMapAction;
