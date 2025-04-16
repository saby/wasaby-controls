import type { highlightFields } from '../types';
import type { THighlightedFieldsMap } from '../../interface/IAbstractListStateParts/IHighlightState';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для установки модели подсветки полей.
 */
export const setHighlightedFieldsMap = (
    highlightedFieldsMap: THighlightedFieldsMap
): highlightFields.TSetHighlightedFieldsMapAction =>
    aCreator('setHighlightedFieldsMap', {
        highlightedFieldsMap,
    });
