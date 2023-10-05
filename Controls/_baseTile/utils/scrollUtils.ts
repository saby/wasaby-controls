/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
export function getScrollLeftToEdgeElement(
    listContainer: HTMLElement,
    direction: 'backward' | 'forward'
): number {
    const itemsElement = Array.from(
        listContainer.querySelectorAll('.controls-TileView > .controls-ListView__itemV')
    ) as HTMLElement[];
    const scrollContainer = listContainer.closest('.controls-Scroll-Container') as HTMLElement;
    if (direction === 'forward') {
        let element = itemsElement.find((item) => {
            return (
                item.getBoundingClientRect().left > scrollContainer.getBoundingClientRect().left &&
                item.getBoundingClientRect().right > scrollContainer.getBoundingClientRect().right
            );
        });
        if (element) {
            return element.offsetLeft;
        } else {
            element = itemsElement[itemsElement.length - 1];
            return element.offsetLeft + element.offsetWidth;
        }
    } else {
        const element = itemsElement.reverse().find((item) => {
            return item.getBoundingClientRect().left < scrollContainer.getBoundingClientRect().left;
        });
        if (element) {
            if (scrollContainer.offsetWidth > element.offsetWidth) {
                return element.offsetLeft - scrollContainer.offsetWidth + element.offsetWidth;
            } else {
                return element.offsetLeft;
            }
        } else {
            return 0;
        }
    }
}
