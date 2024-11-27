import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Тип действия, для установки модели подсветки полей.
 */
export type TSetHighlightedFieldsMapAction = TAbstractAction<
    'setHighlightedFieldsMap',
    {
        highlightedFieldsMap: Map<TKey, string[]>;
    }
>;

/**
 * Тип действий функционала "Работа с подсветкой полей", доступные в WEB списке.
 */
export type TAnyHighlightFieldsAction = TSetHighlightedFieldsMapAction;
