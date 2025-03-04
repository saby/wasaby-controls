import { CrudEntityKey } from 'Types/source';
import { RecordSet } from 'Types/collection';

export interface IStaff {
    key?: CrudEntityKey;
    name?: string;
    position?: string;
    image?: string;
    parent?: CrudEntityKey | null;
    type?: boolean | null;
    startWorkDate?: Date;
    dynamicColumnsData?: RecordSet;
    EventRS?: RecordSet;
}

export const START_DATE = Date.parse('2023-01-01 00:00:00+03');
