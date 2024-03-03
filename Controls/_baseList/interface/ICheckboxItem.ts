export interface ICheckboxItem {
    isSelected: () => boolean;
    isVisibleCheckbox: () => boolean;
    isReadonlyCheckbox: () => boolean;

    getMultiSelectClasses: (
        backgroundColorStyle: string,
        cursor: string,
        highlightOnHover: boolean,
        itemPadding: IItemPadding,
        baseline: string
    ) => string;
}
