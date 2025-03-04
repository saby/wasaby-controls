function isSpaceItem(element: HTMLElement): boolean {
    return element.getAttribute('data-qa') === 'space-item';
}

function checkSpaceItemsBetweenItems(items: HTMLElement[]): void {
    items.forEach((item, index) => {
        const shouldBeSpace = index % 2 === 1;
        expect(isSpaceItem(item)).toBe(shouldBeSpace);
    });
}

export { isSpaceItem, checkSpaceItemsBetweenItems };
