import { THighlightedFieldsMap } from './common/types';

export interface IHighlightFieldsState {
    highlightedFieldsMap: THighlightedFieldsMap;
}

export function copyHighlightFieldsState({
    highlightedFieldsMap,
}: IHighlightFieldsState): IHighlightFieldsState {
    return {
        highlightedFieldsMap: highlightedFieldsMap,
    };
}
