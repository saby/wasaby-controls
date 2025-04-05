/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */

const SCROLL_OFFSET = 10;
export function getScrollLeftToEdgeElement(
    listContainer: HTMLElement,
    direction: 'backward' | 'forward'
): number {
    let scrollOffset = 0;
    // Находим ближайший корень плитки, и смотрим на его детей, чтобы не брать в рассчет вложенные плитки
    const itemsElement = Array.from(
        listContainer
            .querySelector('.controls-TileView')
            .querySelectorAll(':scope > .controls-ListView__itemV')
    ) as HTMLElement[];
    const scrollContainer = listContainer.closest('.controls-Scroll-Container') as HTMLElement;
    const blurContainer = listContainer.closest('.controls-Scroll-Container__base') as HTMLElement;
    const { before, after } = findAdditionalTiles(itemsElement);

    if (blurContainer.className.includes('blur')) {
        scrollOffset = 10;
    }
    const scrollContent = listContainer.closest(
        '.controls-Scroll-ContainerBase__content'
    ) as HTMLElement;
    if (direction === 'forward') {
        let element = itemsElement.find((item) => {
            return (
                item.getBoundingClientRect().left > scrollContainer.getBoundingClientRect().left &&
                item.getBoundingClientRect().right > scrollContainer.getBoundingClientRect().right
            );
        });
        if (element) {
            const rightScrollEdge =
                element.getBoundingClientRect().left + scrollContainer.offsetWidth;
            if (
                after &&
                rightScrollEdge > after.getBoundingClientRect().left &&
                rightScrollEdge < after.getBoundingClientRect().right
            ) {
                return after.offsetLeft + element.offsetWidth;
            }
            return (
                element.getBoundingClientRect().left -
                scrollContent.getBoundingClientRect().left -
                scrollOffset
            );
        } else {
            element = itemsElement[itemsElement.length - 1];
            return element.offsetLeft + element.offsetWidth;
        }
    } else {
        const element = itemsElement.reverse().find((item) => {
            return item.getBoundingClientRect().left < scrollContainer.getBoundingClientRect().left;
        });

        if (element) {
            const scrollTo =
                element.offsetLeft -
                scrollContainer.offsetWidth +
                element.offsetWidth +
                scrollOffset;
            if (before && scrollTo <= before.offsetWidth) return 0;
            if (scrollContainer.offsetWidth > element.offsetWidth) {
                return scrollTo;
            } else {
                return element.offsetLeft + scrollOffset;
            }
        } else {
            return 0;
        }
    }
}

const findAdditionalTiles = (items: HTMLElement[]) => {
    const firstItem = items[0];
    const lastItem = items[items.length - 1];

    return {
        before: firstItem?.classList.contains('controls-TileView__additionalTile')
            ? firstItem
            : null,
        after: lastItem?.classList.contains('controls-TileView__additionalTile') ? lastItem : null,
    };
};
