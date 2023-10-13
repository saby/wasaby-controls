/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
export interface IDisplaySearchValue {
    readonly DisplaySearchValue: boolean;

    setSearchValue(searchValue: string): void;
}

export interface IDisplaySearchValueOptions {
    searchValue?: string;
}
