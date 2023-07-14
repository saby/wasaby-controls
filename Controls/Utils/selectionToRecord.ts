import { adapter, Record } from 'Types/entity';
import type {
    ISelectionObject,
    TSelectionRecord,
    TSelectionType,
    TKeysSelection,
} from 'Controls/interface';

const SELECTION_FORMAT = [
    {
        name: 'marked',
        type: 'array',
        kind: 'string',
    },
    {
        name: 'excluded',
        type: 'array',
        kind: 'string',
    },
    {
        name: 'type',
        type: 'string',
        kind: 'string',
    },
    {
        name: 'recursive',
        type: 'boolean',
        kind: 'boolean',
    },
];

function prepareArray(array: TKeysSelection): string[] {
    return array.map((value) => {
        return (value !== null ? '' + value : value) as string;
    });
}

export default function selectionToRecord(
    selection: ISelectionObject,
    rsAdapter: adapter.IAdapter,
    selectionType: TSelectionType = 'all',
    recursive: boolean = true
): TSelectionRecord {
    const result = new Record({
        adapter: rsAdapter,
        format: SELECTION_FORMAT,
    });

    result.set('marked', prepareArray(selection.selected));
    result.set('excluded', prepareArray(selection.excluded));
    result.set('type', selectionType);
    result.set('recursive', recursive);

    return result;
}
