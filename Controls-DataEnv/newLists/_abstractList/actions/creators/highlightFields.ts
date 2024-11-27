import { highlightFields } from '../types';
import type { TKey } from 'Controls/interface';

/**
 * Конструктор действия, для установки модели подсветки полей.
 * @function
 * @param {Map<TKey, string[]>} highlightedFieldsMap Предыдущее состояние
 * @return highlightFields.TSetHighlightedFieldsMapAction
 */
export const setHighlightedFieldsMap = (
    highlightedFieldsMap: Map<TKey, string[]>
): highlightFields.TSetHighlightedFieldsMapAction => ({
    type: 'setHighlightedFieldsMap',
    payload: {
        highlightedFieldsMap,
    },
});
