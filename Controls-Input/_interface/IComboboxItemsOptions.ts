export interface IComboboxItem {
    id: number;
    title: string;
    additional: boolean;
    text?: string;
    name?: string;
}

export interface IComboboxItemsOptions {
    variants: {
        items: IComboboxItem[];
        selectedKeys?: string[]
    }
}
