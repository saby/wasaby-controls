import type { IHighlightState } from '../interface/IAbstractListStateParts';

export default function initState(): IHighlightState {
    return {
        highlightedFieldsMap: new Map(),
    };
}
