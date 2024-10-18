import { THighlightedFieldsMap } from './common/types';

export const HighlightedFieldsChangeName = 'HIGHLIGHTED_FIELDS_CHANGE';
export type THighlightedFieldsChangeName = typeof HighlightedFieldsChangeName;

/* Изменить видимость ПМО */
export interface IHighlightedFieldsChange {
    name: THighlightedFieldsChangeName;
    args: {
        highlightedFieldsMap: THighlightedFieldsMap;
    };
}

export type THighlightFieldsChanges = IHighlightedFieldsChange;
