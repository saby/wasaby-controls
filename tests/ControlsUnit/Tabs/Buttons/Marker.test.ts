import Marker, {
    AUTO_ALIGN,
    IMarkerElement,
} from 'Controls/_tabs/Buttons/Marker';

describe('Controls/_tabs/Buttons/Marker', () => {
    beforeEach(() => {
        jest.spyOn(Marker, 'getComputedStyle')
            .mockClear()
            .mockReturnValue({ borderLeftWidth: 0, borderRightWidth: 0 });
    });

    const elements: IMarkerElement[] = [
        {
            element: {
                getBoundingClientRect(): DOMRect {
                    return { width: 10, left: 20, right: 0 } as DOMRect;
                },
            } as HTMLElement,
        },
        {
            element: {
                getBoundingClientRect(): DOMRect {
                    return { width: 30, left: 40, right: 0 } as DOMRect;
                },
            } as HTMLElement,
        },
    ];

    const baseElement: HTMLElement = {
        getBoundingClientRect(): DOMRect {
            return { width: 300, left: 10, right: 0 } as DOMRect;
        },
    } as HTMLElement;

    it('should return correct width and offset after initialisation.', () => {
        const marker: Marker = new Marker();

        expect(marker.isInitialized()).toBe(false);

        marker.updatePosition(elements, baseElement);

        expect(marker.isInitialized()).toBe(true);

        expect(marker.getWidth()).not.toBeDefined();
        expect(marker.getOffset()).not.toBeDefined();

        marker.setSelectedIndex(0);

        expect(marker.getWidth()).toBe(10);
        expect(marker.getOffset()).toBe(10);
    });

    describe('setSelectedIndex', () => {
        it("should't update version if selectedIndex changed", () => {
            const marker: Marker = new Marker();
            let changed: boolean;
            marker.updatePosition(elements, baseElement);
            changed = marker.setSelectedIndex(0);
            expect(changed).toBe(true);
            const version: number = marker.getVersion();
            changed = marker.setSelectedIndex(0);
            expect(changed).toBe(false);
            expect(marker.getVersion()).toBe(version);
        });

        it('should update model and version if selectedIndex changed', () => {
            const marker: Marker = new Marker();
            marker.updatePosition(elements, baseElement);
            marker.setSelectedIndex(0);

            const version: number = marker.getVersion();
            marker.setSelectedIndex(1);

            expect(marker.getVersion()).not.toEqual(version);
            expect(marker.getWidth()).toBe(30);
            expect(marker.getOffset()).toBe(30);
        });
    });

    describe('setAlign', () => {
        it('should update align', () => {
            const marker: Marker = new Marker();
            marker.updatePosition(elements, baseElement);
            marker.setSelectedIndex(0);

            marker.setAlign(AUTO_ALIGN.right);
            expect(marker.getOffset()).toBe(0);

            marker.setAlign(AUTO_ALIGN.auto);
            expect(marker.getOffset()).toBe(10);
        });
    });
});
