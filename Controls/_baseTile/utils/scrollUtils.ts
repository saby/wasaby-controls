/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */

const SCROLL_OFFSET = 10;
export function getScrollLeftToEdgeElement(
    listContainer: HTMLElement,
    direction: 'backward' | 'forward'
): number {
    // Находим ближайший корень плитки, и смотрим на его детей, чтобы не брать в рассчет вложенные плитки
    const itemsElement = Array.from(
        listContainer
            .querySelector('.controls-TileView')
            .querySelectorAll(':scope > .controls-ListView__itemV')
    ) as HTMLElement[];
    const scrollContainer = listContainer.closest('.controls-Scroll-Container') as HTMLElement;
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
            return (
                element.getBoundingClientRect().left -
                scrollContent.getBoundingClientRect().left -
                SCROLL_OFFSET
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
            if (scrollContainer.offsetWidth > element.offsetWidth) {
                return (
                    element.offsetLeft -
                    scrollContainer.offsetWidth +
                    element.offsetWidth +
                    SCROLL_OFFSET
                );
            } else {
                return element.offsetLeft + SCROLL_OFFSET;
            }
        } else {
            return 0;
        }
    }
}
