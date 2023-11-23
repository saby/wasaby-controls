import type { CrudEntityKey } from 'Types/source';
import type { RecordSet } from 'Types/collection';

export interface IRootState {
    root?: CrudEntityKey | null;
    items?: RecordSet;
    parentProperty?: string;
    nodeProperty?: string;
    keyProperty?: string;
    declaredChildrenProperty?: string;
}
