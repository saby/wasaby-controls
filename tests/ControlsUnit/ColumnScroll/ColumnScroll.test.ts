import { CssClassesAssert } from './../CustomAsserts';
import { ColumnScrollController as ColumnScroll } from 'Controls/columnScroll';

// @ts-ignore
ColumnScroll.prototype._createGuid = () => {
    return '12345';
};

//# region Mock functions

function mockScrollContainer(params: { offsetWidth: number }): HTMLElement {
    const rect: DOMRect = {
        left: 12,
        right: params.offsetWidth,
    } as DOMRect;
    return {
        getClientRects: () => {
            return [null, null];
        },
        offsetWidth: params.offsetWidth,
        getBoundingClientRect: () => {
            return {
                ...rect,
                toJSON(): DOMRect {
                    return rect;
                },
            };
        },
    } as unknown as HTMLElement;
}

function mockScrollBar() {
    return {
        _container: {
            style: {},
        },
    };
}

function mockStylesContainer(): HTMLStyleElement {
    return {
        innerHTML: '',
    } as unknown as HTMLStyleElement;
}

function mockStickyCellContainer(): HTMLStyleElement {
    return {
        offsetWidth: 300,
        getBoundingClientRect: () => {
            return {
                left: 52,
            };
        },
    } as unknown as HTMLStyleElement;
}

function mockColumnsHTMLContainer(
    columnsSizes: number[] | number[][],
    offset: number
): HTMLDivElement {
    const sticky = mockStickyCellContainer();
    let startPosition;
    const columnsRects: DOMRect[] = [];

    function initStartPosition(): void {
        startPosition =
            offset + sticky.offsetWidth + sticky.getBoundingClientRect().left;
    }

    function collect(row: number[]): void {
        row.forEach((width) => {
            columnsRects.push({
                width,
                left: startPosition,
                right: startPosition + width,
            } as DOMRect);
            startPosition = startPosition + width;
        });
    }

    if (Array.isArray(columnsSizes[0])) {
        columnsSizes.forEach((row) => {
            initStartPosition();
            collect(row);
        });
    } else {
        initStartPosition();
        collect(columnsSizes as number[]);
    }

    return {
        querySelectorAll: (selectors: string): NodeListOf<HTMLElement> => {
            return columnsRects.map((rect) => {
                return {
                    getBoundingClientRect(): DOMRect {
                        return rect;
                    },
                    offsetWidth: rect.width,
                };
            }) as undefined as NodeListOf<HTMLElement>;
        },
    } as HTMLDivElement;
}

function mockContentContainer(params: {
    scrollWidth: number;
    offsetWidth: number;
    stickyElements?: unknown[];
    stickyColumnsCount?: number;
    hasMultiSelect?: boolean;
    scrollPosition?: number;
}): HTMLElement {
    const left = 12 + params.scrollPosition ? params.scrollPosition : 0;
    return {
        scrollWidth: params.scrollWidth,
        offsetWidth: params.offsetWidth,
        querySelectorAll: () => {
            return [];
        },
        querySelector: (selector: string) => {
            const lastStickyColumnSelector = `.controls-ColumnScroll__fixedElement:nth-child(${
                (params.stickyColumnsCount || 1) +
                (params.hasMultiSelect ? 1 : 0)
            })`;
            if (selector === lastStickyColumnSelector) {
                return mockStickyCellContainer();
            }
        },
        getBoundingClientRect: () => {
            return {
                left,
                right: left + params.scrollWidth,
            };
        },
    } as unknown as HTMLElement;
}

//# endregion

describe('Controls/columnScroll', () => {
    let columnScroll: ColumnScroll;

    //# region beforeEach
    beforeEach(() => {
        const cfg = {
            hasMultiSelect: false,
            stickyColumnsCount: 2,
        };
        columnScroll = new ColumnScroll(cfg);

        columnScroll.setContainers({
            scrollContainer: mockScrollContainer({
                offsetWidth: 600,
            }),
            contentContainer: mockContentContainer({
                ...cfg,
                scrollWidth: 782,
                offsetWidth: 600,
            }),
            stylesContainer: mockStylesContainer(),
        });
    });
    //# endregion

    // TODO: Убрать ts-ignore
    it('.getShadowClasses()', () => {
        CssClassesAssert.isSame(
            ColumnScroll.getShadowClasses('start', {
                isVisible: true,
                backgroundStyle: 'default',
            }),
            [
                'js-controls-ColumnScroll__shadow_position-start',
                'controls-ColumnScroll__shadow',
                'controls-ColumnScroll__shadow_without-bottom-padding',
                'controls-ColumnScroll__shadow_position-start',
                'controls-ColumnScroll__shadow-default',
            ]
        );

        CssClassesAssert.isSame(
            ColumnScroll.getShadowClasses('end', {
                isVisible: true,
                backgroundStyle: 'default',
            }),
            [
                'js-controls-ColumnScroll__shadow_position-end',
                'controls-ColumnScroll__shadow',
                'controls-ColumnScroll__shadow_without-bottom-padding',
                'controls-ColumnScroll__shadow_position-end',
                'controls-ColumnScroll__shadow-default',
            ]
        );
    });

    describe('shouldDrawColumnScroll', () => {
        it('can not calc fixed part width if column scroll is not needed', () => {
            expect(() => {
                const result = ColumnScroll.shouldDrawColumnScroll(
                    {
                        horizontalScrollBar: mockScrollBar(),
                        header: {},
                        grid: mockContentContainer({
                            scrollWidth: 600,
                            offsetWidth: 600,
                        }),
                        gridWrapper: mockScrollContainer({ offsetWidth: 600 }),
                    },
                    () => {
                        // Этот колбек считает ширину фиксированной части.
                        throw Error(
                            'can not calc fixed part width if column scroll is not needed!'
                        );
                    },
                    true
                );
                expect(result.status).toBe(false);
                expect(result.sizes.fixedColumnsWidth).toEqual(0);
            }).not.toThrow();
        });
    });
});
