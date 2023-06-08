/**
 * @jest-environment jsdom
 */
import { StickyIntersectionController } from 'Controls/_stickyBlock/Controllers/StickyIntersectionController';

describe('Controls/_stickyBlock/Controllers/StickyintersectionController', () => {
    function getObservers(): object {
        return {
            observerTop: {
                current: {
                    setAttribute: () => {
                        return 0;
                    },
                },
            },
            observerTop2: {
                current: {
                    setAttribute: () => {
                        return 0;
                    },
                },
            },
            observerTop2Right: {
                current: {
                    setAttribute: () => {
                        return 0;
                    },
                },
            },
            observerBottomLeft: {
                current: {
                    setAttribute: () => {
                        return 0;
                    },
                },
            },
            observerBottomRight: {
                current: {
                    setAttribute: () => {
                        return 0;
                    },
                },
            },
            observerLeft: {
                current: {
                    setAttribute: () => {
                        return 0;
                    },
                },
            },
            observerRight: {
                current: {
                    setAttribute: () => {
                        return 0;
                    },
                },
            },
        };
    }

    let observeMockFunc;
    let unobserveMockFunc;
    beforeEach(() => {
        observeMockFunc = jest.fn();
        unobserveMockFunc = jest.fn();
        const mockIntersectionObserver = jest.fn().mockReturnValue({
            observe: observeMockFunc,
            unobserve: unobserveMockFunc,
            disconnect: jest.fn(),
        });
        window.IntersectionObserver = mockIntersectionObserver;
    });

    afterEach(() => {
        observeMockFunc = null;
        unobserveMockFunc = null;
    });

    // Должны заобсервится все обсерверы.
    it('Обсервятся все шесть обсерверов', () => {
        const stickyIntersectionController = new StickyIntersectionController(
            undefined,
            undefined,
            undefined
        );
        const stickyBlock = {
            observers: getObservers(),
        };
        stickyIntersectionController.init(document.createElement('div'));
        stickyIntersectionController.observe(stickyBlock);
        expect(observeMockFunc).toHaveBeenCalledTimes(7);
    });

    // Должны заанобсервится все обсерверы.
    it('Анобсервятся все шесть обсерверов', () => {
        const stickyBlock = {
            observers: getObservers(),
        };
        const blocks = {
            get: () => {
                return stickyBlock;
            },
        };
        const stickyIntersectionController = new StickyIntersectionController(
            blocks,
            undefined,
            undefined
        );
        stickyIntersectionController.init(document.createElement('div'));
        stickyIntersectionController.unobserve('0');
        expect(unobserveMockFunc).toHaveBeenCalledTimes(7);
    });
});
