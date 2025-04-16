export interface ICategories {
    [key: string]: ICategory;
}

export interface ICategory {
    parent?: string;
}
