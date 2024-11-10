export interface IItem {
    id: string | number;
    text?: string;
    title: string;
    parent?: string | null;
    node: true | false | null;
    name?: string;
}

export interface IItemsOptions {
    variants?: {
        items: IItem[];
        selectedKeys?: string[]
    }
}
