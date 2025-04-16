import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { THighlightedFieldsMap } from '../../interface/IAbstractListStateParts/IHighlightState';

/**
 * Тип действия, для установки модели подсветки полей.
 */
export type TSetHighlightedFieldsMapAction = TAbstractAction<
    'setHighlightedFieldsMap',
    {
        highlightedFieldsMap: THighlightedFieldsMap;
    }
>;

/**
 * Тип действий функционала "Работа с подсветкой полей", доступные в WEB списке.
 */
export type TAnyHighlightFieldsAction = TSetHighlightedFieldsMapAction;
