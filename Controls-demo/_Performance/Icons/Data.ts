interface IIconDemoItem {
    id: number;
    svgIcon: string;
    fontIcon: string;
    title: string;
}

export function getData(count: number = 1000): IIconDemoItem[] {
    const items = [];

    for (let i = 0; i < count; i++) {
        items.push({
            id: i,
            fontIcon: 'icon-Favorite',
            svgIcon: 'Controls-demo/icons:icon-Successful',
            title: `Элемент ${i}`,
            svgIconUrl: 'Controls-demo/icons:icon-Successful',
        });
    }
    return items;
}
