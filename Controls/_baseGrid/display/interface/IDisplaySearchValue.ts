/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
export interface IDisplaySearchValue {
    readonly DisplaySearchValue: boolean;

    setSearchValue(searchValue: string): void;
}

export interface IDisplaySearchValueOptions {
    searchValue?: string;
}
