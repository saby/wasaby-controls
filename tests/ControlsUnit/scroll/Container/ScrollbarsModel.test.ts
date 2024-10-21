import ScrollbarsModel from 'Controls/_scroll/Container/ScrollbarsModel';
import { SCROLL_MODE } from 'Controls/_scroll/Container/Type';
import { SCROLL_DIRECTION } from 'Controls/_scroll/Utils/Scroll';

describe('Controls/scroll:Container ScrollbarsModel', () => {
    describe('constructor', () => {
        [
            {
                scrollOrientation: SCROLL_MODE.VERTICAL,
                direction: [SCROLL_DIRECTION.VERTICAL],
            },
            {
                scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
                direction: [SCROLL_DIRECTION.VERTICAL, SCROLL_DIRECTION.HORIZONTAL],
            },
        ].forEach((test) => {
            it(`should init scrollbars models. ${test.scrollOrientation}`, () => {
                const model: ScrollbarsModel = new ScrollbarsModel({
                    scrollbarVisible: true,
                    scrollOrientation: test.scrollOrientation,
                });
                expect(Object.keys(model._models)).toEqual(test.direction);
                for (const direction of test.direction) {
                    expect(model._models[direction].isVisible).toBe(false);
                    expect(model._models[direction].position).toBe(0);
                    expect(model._models[direction].contentSize).not.toBeDefined();
                }
            });
        });
    });

    describe('updateScrollState', () => {
        const scrollState = {
            scrollTop: 10,
            scrollLeft: 20,
            scrollHeight: 30,
            scrollWidth: 40,
        };
        it('should update position and contentSize.', () => {
            const model: ScrollbarsModel = new ScrollbarsModel({
                scrollbarVisible: true,
                scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
            });

            // В реальнности метод задебоунсен, в тестах выключаем дебоунс.
            model._updateContainerSizes = ScrollbarsModel.prototype._updateContainerSizes;

            model.updateScrollState(scrollState, { offsetHeight: 50 });

            expect(model._models.vertical.position).toBe(scrollState.scrollTop);
            expect(model._models.horizontal.position).toBe(scrollState.scrollLeft);
            expect(model._models.vertical.contentSize).toBe(scrollState.scrollHeight);
            expect(model._models.horizontal.contentSize).toBe(scrollState.scrollWidth);
        });

        it("should't update view if can't scroll.", () => {
            const model: ScrollbarsModel = new ScrollbarsModel({
                scrollbarVisible: true,
                scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
            });
            const scrollState = {
                scrollTop: 0,
                scrollLeft: 0,
                scrollHeight: 30,
                scrollWidth: 40,
                canVerticalScroll: false,
                canHorizontalScroll: false,
            };

            // В реальнности метод задебоунсен, в тестах выключаем дебоунс.
            model._updateContainerSizes = ScrollbarsModel.prototype._updateContainerSizes;

            jest.spyOn(model, '_nextVersion').mockClear().mockImplementation();

            model.updateScrollState(scrollState, { offsetHeight: 50 });

            expect(model._nextVersion).not.toHaveBeenCalled();

            jest.restoreAllMocks();
        });

        it('should set _overflowHidden to true if content fits into the container.', () => {
            const model: ScrollbarsModel = new ScrollbarsModel({
                scrollbarVisible: true,
                scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
            });

            model.updateScrollState(scrollState, { offsetHeight: 30 });

            expect(model._overflowHidden).toBe(false);
        });
    });

    describe('updatePlaceholdersSize', () => {
        const scrollState = {
            scrollTop: 10,
            scrollLeft: 20,
            scrollHeight: 30,
            scrollWidth: 40,
        };

        [
            {
                placeholders: { top: 10, bottom: 10, left: 10, right: 10 },
            },
            {
                placeholders: { top: 10, bottom: 10 },
            },
        ].forEach((test) => {
            it('should update position and contentSize.', () => {
                const model: ScrollbarsModel = new ScrollbarsModel({
                    scrollbarVisible: true,
                    scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
                });

                // В реальнности метод задебоунсен, в тестах выключаем дебоунс.
                model._updateContainerSizes = ScrollbarsModel.prototype._updateContainerSizes;

                model.updateScrollState(scrollState, { offsetHeight: 50 });
                model.updatePlaceholdersSize(test.placeholders);

                expect(model._models.vertical.position).toBe(
                    scrollState.scrollTop + (test.placeholders.top || 0)
                );
                expect(model._models.horizontal.position).toBe(
                    scrollState.scrollLeft + (test.placeholders.left || 0)
                );
                expect(model._models.vertical.contentSize).toBe(
                    scrollState.scrollHeight +
                        (test.placeholders.top || 0) +
                        (test.placeholders.bottom || 0)
                );
                expect(model._models.horizontal.contentSize).toBe(
                    scrollState.scrollWidth +
                        (test.placeholders.left || 0) +
                        (test.placeholders.right || 0)
                );
            });
        });
    });

    describe('updateScrollbarsModels', () => {
        it('should update _models if scrollOrientation changed', () => {
            const model: ScrollbarsModel = new ScrollbarsModel({
                scrollbarVisible: true,
                scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
            });
            expect(Object.keys(model._models).length).toEqual(2);
            model.updateScrollbarsModels({
                scrollbarVisible: true,
                scrollOrientation: SCROLL_MODE.VERTICAL,
            });
            expect(Object.keys(model._models).length).toEqual(1);
        });
    });

    describe('updateOptions', () => {
        it('should set isVisible to true, if there was no wheel event', () => {
            const model: ScrollbarsModel = new ScrollbarsModel({
                scrollbarVisible: true,
                scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
            });
            model._models.vertical._canScroll = true;
            model._models.horizontal._canScroll = true;
            model.updateOptions({
                scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
                scrollbarVisible: false,
            });
            expect(model._models.vertical.isVisible).toBe(true);
            expect(model._models.horizontal.isVisible).toBe(true);
            ScrollbarsModel.wheelEventHappened = true;
            model.updateOptions({
                scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
                scrollbarVisible: false,
            });
            expect(model._models.vertical.isVisible).toBe(false);
            expect(model._models.horizontal.isVisible).toBe(false);
        });
    });

    describe('setOffsets', () => {
        it('should update scrollbars styles.', () => {
            const model: ScrollbarsModel = new ScrollbarsModel({
                scrollbarVisible: true,
                scrollOrientation: 'vertical',
            });

            model.setOffsets({ top: 10, bottom: 20 });

            expect(model._models.vertical.style).toBe('top: 10px; bottom: 20px;');
        });
    });
});
