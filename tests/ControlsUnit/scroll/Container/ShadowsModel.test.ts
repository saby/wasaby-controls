import ShadowsModel from 'Controls/_scroll/Container/ShadowsModel';
import {
    getDefaultOptions as getShadowsDefaultOptions,
    SHADOW_VISIBILITY,
} from 'Controls/_scroll/Container/Interface/IShadows';
import { SCROLL_MODE } from 'Controls/_scroll/Container/Type';
import { SCROLL_POSITION } from 'Controls/_scroll/Utils/Scroll';

describe('Controls/scroll:Container ShadowsModel', () => {
    const positions = ['top', 'bottom'];

    describe('constructor', () => {
        [
            {
                scrollOrientation: SCROLL_MODE.VERTICAL,
                positions: ['top', 'bottom'],
            },
            {
                scrollOrientation: SCROLL_MODE.VERTICAL_HORIZONTAL,
                positions: ['top', 'bottom', 'left', 'right'],
            },
        ].forEach((test) => {
            it(`should init shadow models. ${test.scrollOrientation}`, () => {
                const component = new ShadowsModel({
                    ...getShadowsDefaultOptions(),
                    scrollOrientation: test.scrollOrientation,
                });
                expect(Object.keys(component._models)).toEqual(test.positions);
                for (const position of test.positions) {
                    expect(component._models[position].isEnabled).toBe(false);
                    expect(component._models[position].isVisible).toBe(false);
                }
            });
        });
    });

    describe('updateScrollState', () => {
        [
            {
                title: 'should show shadows if shadow visibility is auto and scroll position is middle',
                options: {},
                args: {
                    verticalPosition: 'middle',
                    canVerticalScroll: true,
                },
                isEnabled: true,
                isVisible: true,
            },
            {
                title: 'should not show shadows if shadow visibility is hidden',
                options: {
                    topShadowVisibility: SHADOW_VISIBILITY.HIDDEN,
                    bottomShadowVisibility: SHADOW_VISIBILITY.HIDDEN,
                },
                args: {
                    verticalPosition: 'middle',
                    canVerticalScroll: true,
                },
                isEnabled: false,
                isVisible: false,
            },
            {
                title: 'should not show shadows if can not scroll',
                options: {},
                args: {
                    verticalPosition: 'start',
                    canVerticalScroll: false,
                },
                isEnabled: false,
                isVisible: false,
            },
            {
                title: 'should show bottom shadow',
                options: {},
                args: {
                    verticalPosition: 'start',
                    canVerticalScroll: true,
                },
                isEnabled: true,
                isTopVisible: false,
                isBottomVisible: true,
            },
            {
                title: 'should show top shadow',
                options: {},
                args: {
                    verticalPosition: 'end',
                    canVerticalScroll: true,
                },
                isEnabled: true,
                isTopVisible: true,
                isBottomVisible: false,
            },
        ].forEach((test) => {
            it(test.title, () => {
                const component = new ShadowsModel({
                    ...getShadowsDefaultOptions(),
                    scrollOrientation: 'vertical',
                    ...test.options,
                });
                component.updateScrollState(test.args);
                if ('isEnabled' in test) {
                    for (const position of positions) {
                        expect(component._models[position].isEnabled).toBe(
                            test.isEnabled
                        );
                    }
                }
                if ('isVisible' in test) {
                    for (const position of positions) {
                        expect(component._models[position].isVisible).toBe(
                            test.isVisible
                        );
                    }
                }
                if ('isTopVisible' in test) {
                    expect(component._models.top.isVisible).toBe(
                        test.isTopVisible
                    );
                }
                if ('isBottomVisible' in test) {
                    expect(component._models.bottom.isVisible).toBe(
                        test.isBottomVisible
                    );
                }
            });
        });
    });

    describe('setStickyFixed', () => {
        [
            {
                topFixed: true,
                bottomFixed: true,
                shouldCallNextVersion: true,
            },
            {
                topFixed: true,
                bottomFixed: false,
                shouldCallNextVersion: true,
            },
            {
                topFixed: false,
                bottomFixed: true,
                shouldCallNextVersion: true,
            },
            {
                topFixed: false,
                bottomFixed: false,
                shouldCallNextVersion: false,
            },
            {
                topFixed: true,
                bottomFixed: true,
                needUpdate: false,
                shouldCallNextVersion: false,
            },
            {
                topFixed: true,
                bottomFixed: true,
                topVisibilityByInnerComponents: SHADOW_VISIBILITY.VISIBLE,
                needUpdate: false,
                shouldCallNextVersion: true,
            },
        ].forEach((test, index) => {
            it(`should ${
                !test.shouldCallNextVersion ? 'not' : ''
            } call next version ${index}`, () => {
                const component = new ShadowsModel({
                    ...getShadowsDefaultOptions(),
                    scrollOrientation: 'vertical',
                });

                component._models.top._isEnabled = true;
                component._models.bottom._isEnabled = true;

                jest.spyOn(component, '_nextVersion')
                    .mockClear()
                    .mockImplementation();

                if (test.topVisibilityByInnerComponents) {
                    component._models.top._visibilityByInnerComponents =
                        test.topVisibilityByInnerComponents;
                }

                component.setStickyFixed(
                    test.topFixed,
                    test.bottomFixed,
                    false,
                    false,
                    test.needUpdate
                );
                if (test.shouldCallNextVersion) {
                    expect(component._nextVersion).toHaveBeenCalled();
                } else {
                    expect(component._nextVersion).not.toHaveBeenCalled();
                }
            });
        });
    });

    describe('updateVisibilityByInnerComponents', () => {
        it('should`t update shadow visibility if it can scroll..', () => {
            const shadows = new ShadowsModel({
                ...getShadowsDefaultOptions(),
                scrollOrientation: SCROLL_MODE.VERTICAL,
            });
            shadows.updateScrollState({
                canVerticalScroll: true,
                verticalPosition: SCROLL_POSITION.START,
            });
            const version = shadows.getVersion();
            shadows.updateVisibilityByInnerComponents({
                top: SHADOW_VISIBILITY.VISIBLE,
                bottom: SHADOW_VISIBILITY.VISIBLE,
            });
            expect(shadows.top.isEnabled).toBe(true);
            expect(shadows.bottom.isEnabled).toBe(true);
            expect(shadows.getVersion()).not.toBe(version);
        });
        it("should`t update shadow visibility if it doesn't scroll.", () => {
            const shadows = new ShadowsModel({
                ...getShadowsDefaultOptions(),
                scrollOrientation: SCROLL_MODE.VERTICAL,
            });
            shadows.updateScrollState({
                canVerticalScroll: false,
                verticalPosition: SCROLL_POSITION.START,
            });
            shadows.updateVisibilityByInnerComponents({
                top: SHADOW_VISIBILITY.VISIBLE,
                bottom: SHADOW_VISIBILITY.VISIBLE,
            });
            expect(shadows.top.isEnabled).toBe(false);
            expect(shadows.bottom.isEnabled).toBe(false);
        });

        it('should\' change "isEnabled" if there are fixed headers.', () => {
            const shadows = new ShadowsModel({
                ...getShadowsDefaultOptions(),
                scrollOrientation: SCROLL_MODE.VERTICAL,
            });
            shadows.setStickyFixed(true, true, false, false);
            const version = shadows.getVersion();
            shadows.updateVisibilityByInnerComponents({
                top: SHADOW_VISIBILITY.VISIBLE,
                bottom: SHADOW_VISIBILITY.VISIBLE,
            });
            expect(shadows.top.isEnabled).toBe(false);
            expect(shadows.bottom.isEnabled).toBe(false);
            expect(shadows.getVersion()).toBe(version);
        });
    });

    describe('hasVisibleShadow', () => {
        it('should return false if there is no visible shadows.', () => {
            const shadows = new ShadowsModel({
                ...getShadowsDefaultOptions(),
                scrollOrientation: SCROLL_MODE.VERTICAL,
            });
            expect(shadows.hasVisibleShadow()).toBe(false);
        });
        it('should return true if there is visible shadows.', () => {
            const shadows = new ShadowsModel({
                ...getShadowsDefaultOptions(),
                scrollOrientation: SCROLL_MODE.VERTICAL,
            });
            shadows.top._isVisible = true;
            expect(shadows.hasVisibleShadow()).toBe(true);
        });
    });
    describe('_getShadowEnable', () => {
        [
            {
                visibilityByInnerComponents: true,
                topShadowVisibility: 'hidden',
                shadowVisible: false,
            },
            {
                visibilityByInnerComponents: false,
                topShadowVisibility: 'visible',
                shadowVisible: true,
            },
        ].forEach((test) => {
            it('should ignore visibilityByInnerComponents when shadowVisibility is not "auto"', () => {
                const shadows = new ShadowsModel({
                    topShadowVisibility: test.topShadowVisibility,
                    scrollOrientation: SCROLL_MODE.VERTICAL,
                });
                shadows.top._visibilityByInnerComponents =
                    test.visibilityByInnerComponents;
                const shadowVisible = shadows.top._getShadowEnable();
                expect(test.shadowVisible).toEqual(shadowVisible);
            });
        });
    });
});
