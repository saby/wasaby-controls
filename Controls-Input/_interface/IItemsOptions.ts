import { RecordSet } from 'Types/collection';

export interface IItem {
    id: string;
    text: string;
    parent?: string;
    node: true | false | null;
    name?: string;
}

export interface IItemsOptions {
    items: RecordSet<IItem>;
}
