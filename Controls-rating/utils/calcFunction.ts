export interface IItem {
    name: string;
    icon: string;
    color: string;
}

export const getItemMargin = (iconSize: string): string => {
    return iconSize === 'm' ? 's' : 'm';
};

export const getItemSelected = (
    selectedValue: number,
    item: IItem,
    hash: object
): string => {
    return selectedValue === hash[item.name]
        ? 'controls-icon_style-' + item.color
        : '';
};
