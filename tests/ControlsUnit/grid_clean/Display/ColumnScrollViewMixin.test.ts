import {
    isSizeAffectsOptionsChanged,
    destroyColumnScroll,
} from 'Controls/_grid/ViewMixins/ColumnScrollViewMixin';
import { RecordSet } from 'Types/collection';

describe('Controls/grid_clean/Display/ColumnScrollViewMixin', () => {
    describe('isSizeAffectsOptionsChanged', () => {
        it('items updated', () => {
            const oldItems = new RecordSet({ keyProperty: '', rawData: [] });
            const newItems = new RecordSet({ keyProperty: '', rawData: [{}] });

            expect(
                isSizeAffectsOptionsChanged(
                    { items: oldItems },
                    { items: oldItems }
                )
            ).toBe(false);
            expect(
                isSizeAffectsOptionsChanged(
                    { items: oldItems },
                    { items: newItems }
                )
            ).toBe(true);
        });

        it('expanded items updated', () => {
            const oldExpandedItems = [1];
            const newExpandedItems = [1, 2];
            expect(
                isSizeAffectsOptionsChanged(
                    { expandedItems: oldExpandedItems },
                    { expandedItems: oldExpandedItems }
                )
            ).toBe(false);
            expect(
                isSizeAffectsOptionsChanged(
                    { expandedItems: oldExpandedItems },
                    { expandedItems: newExpandedItems }
                )
            ).toBe(true);
        });
    });

    describe('destroy scroll controller', () => {
        it('update sizes in scrollBar', () => {
            let wasUdated = false;
            const mixedView = {
                _$columnScrollController: {
                    destroy: () => {
                        /* MOCK */
                    },
                },
                _children: {
                    horizontalScrollBar: {
                        setSizes: (sizes) => {
                            wasUdated = true;
                            expect(sizes).toEqual({ scrollWidth: 0 });
                        },
                    },
                },
                _notify: () => {
                    /* MOCK */
                },
            };
            destroyColumnScroll(mixedView);
            expect(wasUdated).toBe(true);
        });
    });
});
