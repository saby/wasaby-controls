import { createAnimation } from 'Controls/_columnScrollReact/ApplyCssTransform/smoothTransformAnimationUtil';

describe('ControlsUnit/columnScrollReact/ApplyCssTransform/smoothTransformAnimationUtil', () => {
    it('0 => 100', () => {
        const animation = createAnimation(0, 100, '1.3s');
        expect(animation).toEqual({
            fixationAnimation: {
                id: 'fixationAnimation',
                keyframe:
                    '@keyframes fixationAnimation {from{transform:translate3d(0px,0,0);}to{transform:translate3d(100px,0,0);}}',
                rule: 'animation-name: fixationAnimation;animation-duration: 1.3s;',
            },
            scrollAnimation: {
                id: 'scrollAnimation',
                keyframe:
                    '@keyframes scrollAnimation {from{transform:translate3d(0px,0,0);}to{transform:translate3d(-100px,0,0);}}',
                rule: 'animation-name: scrollAnimation;animation-duration: 1.3s;',
            },
        } as typeof animation);
    });

    it('0 => -100', () => {
        const animation = createAnimation(0, -100, '0.3s');
        expect(animation).toEqual({
            fixationAnimation: {
                id: 'fixationAnimation',
                keyframe:
                    '@keyframes fixationAnimation {from{transform:translate3d(0px,0,0);}to{transform:translate3d(-100px,0,0);}}',
                rule: 'animation-name: fixationAnimation;animation-duration: 0.3s;',
            },
            scrollAnimation: {
                id: 'scrollAnimation',
                keyframe:
                    '@keyframes scrollAnimation {from{transform:translate3d(0px,0,0);}to{transform:translate3d(100px,0,0);}}',
                rule: 'animation-name: scrollAnimation;animation-duration: 0.3s;',
            },
        } as typeof animation);
    });

    it('-100 => 0', () => {
        const animation = createAnimation(-100, 0, '1s');
        expect(animation).toEqual({
            fixationAnimation: {
                id: 'fixationAnimation',
                keyframe:
                    '@keyframes fixationAnimation {from{transform:translate3d(-100px,0,0);}to{transform:translate3d(0px,0,0);}}',
                rule: 'animation-name: fixationAnimation;animation-duration: 1s;',
            },
            scrollAnimation: {
                id: 'scrollAnimation',
                keyframe:
                    '@keyframes scrollAnimation {from{transform:translate3d(100px,0,0);}to{transform:translate3d(0px,0,0);}}',
                rule: 'animation-name: scrollAnimation;animation-duration: 1s;',
            },
        } as typeof animation);
    });

    it('-100 => 100', () => {
        const animation = createAnimation(-100, 100, '0s');
        expect(animation).toEqual({
            fixationAnimation: {
                id: 'fixationAnimation',
                keyframe:
                    '@keyframes fixationAnimation {from{transform:translate3d(-100px,0,0);}to{transform:translate3d(100px,0,0);}}',
                rule: 'animation-name: fixationAnimation;animation-duration: 0s;',
            },
            scrollAnimation: {
                id: 'scrollAnimation',
                keyframe:
                    '@keyframes scrollAnimation {from{transform:translate3d(100px,0,0);}to{transform:translate3d(-100px,0,0);}}',
                rule: 'animation-name: scrollAnimation;animation-duration: 0s;',
            },
        } as typeof animation);
    });
});
