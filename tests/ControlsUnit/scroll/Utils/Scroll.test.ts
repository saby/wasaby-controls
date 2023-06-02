import {
    scrollTo,
    SCROLL_DIRECTION,
    getScrollPositionByState,
    getViewportSizeByState,
    getContentSizeByState,
    getScrollPositionTypeByState,
    SCROLL_POSITION,
} from 'Controls/_scroll/Utils/Scroll';
import { SCROLL_MODE } from 'Controls/_scroll/Container/Type';

describe('Controls/_scroll/Utils/Scroll', () => {
    describe('scrollTo', () => {
        [
            {
                position: 20,
                direction: SCROLL_DIRECTION.VERTICAL,
                scrollTop: 20,
                scrollLeft: undefined,
            },
            {
                position: 20,
                direction: SCROLL_DIRECTION.HORIZONTAL,
                scrollTop: undefined,
                scrollLeft: 20,
            },
        ].forEach((test, i: number) => {
            it(`test ${i}. direction ${test.direction}`, () => {
                const container = {};
                scrollTo(container, test.position, test.direction);
                expect(container.scrollTop).toBe(test.scrollTop);
                expect(container.scrollLeft).toBe(test.scrollLeft);
            });
        });
    });

    describe('getScrollPositionByState', () => {
        [
            {
                direction: SCROLL_DIRECTION.VERTICAL,
                state: {
                    scrollTop: 20,
                    scrollLeft: undefined,
                },
                position: 20,
            },
            {
                direction: SCROLL_DIRECTION.HORIZONTAL,
                state: {
                    scrollTop: undefined,
                    scrollLeft: 20,
                },
                position: 20,
            },
        ].forEach((test, i: number) => {
            it(`test ${i}. direction ${test.direction}`, () => {
                const container = {};
                expect(
                    getScrollPositionByState(test.state, test.direction)
                ).toBe(test.position);
            });
        });
    });

    describe('getViewportSizeByState', () => {
        [
            {
                direction: SCROLL_DIRECTION.VERTICAL,
                state: {
                    clientHeight: 20,
                    clientWidth: undefined,
                },
                size: 20,
            },
            {
                direction: SCROLL_DIRECTION.HORIZONTAL,
                state: {
                    clientHeight: undefined,
                    clientWidth: 20,
                },
                size: 20,
            },
        ].forEach((test, i: number) => {
            it(`test ${i}. direction ${test.direction}`, () => {
                const container = {};
                expect(getViewportSizeByState(test.state, test.direction)).toBe(
                    test.size
                );
            });
        });
    });

    describe('getContentSizeByState', () => {
        [
            {
                direction: SCROLL_DIRECTION.VERTICAL,
                state: {
                    scrollHeight: 20,
                    scrollWidth: undefined,
                },
                size: 20,
            },
            {
                direction: SCROLL_DIRECTION.HORIZONTAL,
                state: {
                    scrollHeight: undefined,
                    scrollWidth: 20,
                },
                size: 20,
            },
        ].forEach((test, i: number) => {
            it(`test ${i}. direction ${test.direction}`, () => {
                const container = {};
                expect(getContentSizeByState(test.state, test.direction)).toBe(
                    test.size
                );
            });
        });
    });

    describe('getScrollPositionTypeByState', () => {
        [
            {
                direction: SCROLL_DIRECTION.VERTICAL,
                state: {
                    scrollTop: 0,
                    scrollHeight: 40,
                    clientHeight: 20,
                },
                scrollPositionType: SCROLL_POSITION.START,
            },
            {
                direction: SCROLL_DIRECTION.VERTICAL,
                state: {
                    scrollTop: 10,
                    scrollHeight: 40,
                    clientHeight: 20,
                },
                scrollPositionType: SCROLL_POSITION.MIDDLE,
            },
            {
                direction: SCROLL_DIRECTION.VERTICAL,
                state: {
                    scrollTop: 20,
                    scrollHeight: 40,
                    clientHeight: 20,
                },
                scrollPositionType: SCROLL_POSITION.END,
            },
            {
                direction: SCROLL_DIRECTION.HORIZONTAL,
                state: {
                    scrollLeft: 0,
                    scrollWidth: 40,
                    clientWidth: 20,
                },
                scrollPositionType: SCROLL_POSITION.START,
            },
            {
                direction: SCROLL_DIRECTION.HORIZONTAL,
                state: {
                    scrollLeft: 10,
                    scrollWidth: 40,
                    clientWidth: 20,
                },
                scrollPositionType: SCROLL_POSITION.MIDDLE,
            },
            {
                direction: SCROLL_DIRECTION.HORIZONTAL,
                state: {
                    scrollLeft: 20,
                    scrollWidth: 40,
                    clientWidth: 20,
                },
                scrollPositionType: SCROLL_POSITION.END,
            },
        ].forEach((test, i: number) => {
            it(`test ${i}. direction ${test.direction}`, () => {
                const container = {};
                expect(
                    getScrollPositionTypeByState(test.state, test.direction)
                ).toBe(test.scrollPositionType);
            });
        });
    });
});
