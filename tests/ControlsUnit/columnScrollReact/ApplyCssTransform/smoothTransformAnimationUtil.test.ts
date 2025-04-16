import { createAnimation } from 'Controls/_columnScrollReact/ApplyCssTransform/smoothTransformAnimationUtil';

describe('ControlsUnit/columnScrollReact/ApplyCssTransform/smoothTransformAnimationUtil', () => {
    it('0 => 100', () => {
        const animation = createAnimation('defaultID', 0, 100, '1.3s');
        expect(animation).toEqual({
            fixationAnimation: {
                id: 'fixationAnimation_defaultID',
                keyframe:
                    '@keyframes fixationAnimation_defaultID {from{transform:translate3d(0px,0,0);}to{transform:translate3d(100px,0,0);}}',
                rule: 'animation-name: fixationAnimation_defaultID;animation-duration: 1.3s;',
            },
            scrollAnimation: {
                id: 'scrollAnimation_defaultID',
                keyframe:
                    '@keyframes scrollAnimation_defaultID {from{transform:translate3d(0px,0,0);}to{transform:translate3d(-100px,0,0);}}',
                rule: 'animation-name: scrollAnimation_defaultID;animation-duration: 1.3s;',
            },
        } as typeof animation);
    });

    it('0 => -100', () => {
        const animation = createAnimation('defaultID', 0, -100, '0.3s');
        expect(animation).toEqual({
            fixationAnimation: {
                id: 'fixationAnimation_defaultID',
                keyframe:
                    '@keyframes fixationAnimation_defaultID {from{transform:translate3d(0px,0,0);}to{transform:translate3d(-100px,0,0);}}',
                rule: 'animation-name: fixationAnimation_defaultID;animation-duration: 0.3s;',
            },
            scrollAnimation: {
                id: 'scrollAnimation_defaultID',
                keyframe:
                    '@keyframes scrollAnimation_defaultID {from{transform:translate3d(0px,0,0);}to{transform:translate3d(100px,0,0);}}',
                rule: 'animation-name: scrollAnimation_defaultID;animation-duration: 0.3s;',
            },
        } as typeof animation);
    });

    it('-100 => 0', () => {
        const animation = createAnimation('defaultID', -100, 0, '1s');
        expect(animation).toEqual({
            fixationAnimation: {
                id: 'fixationAnimation_defaultID',
                keyframe:
                    '@keyframes fixationAnimation_defaultID {from{transform:translate3d(-100px,0,0);}to{transform:translate3d(0px,0,0);}}',
                rule: 'animation-name: fixationAnimation_defaultID;animation-duration: 1s;',
            },
            scrollAnimation: {
                id: 'scrollAnimation_defaultID',
                keyframe:
                    '@keyframes scrollAnimation_defaultID {from{transform:translate3d(100px,0,0);}to{transform:translate3d(0px,0,0);}}',
                rule: 'animation-name: scrollAnimation_defaultID;animation-duration: 1s;',
            },
        } as typeof animation);
    });

    it('-100 => 100', () => {
        const animation = createAnimation('defaultID', -100, 100, '0s');
        expect(animation).toEqual({
            fixationAnimation: {
                id: 'fixationAnimation_defaultID',
                keyframe:
                    '@keyframes fixationAnimation_defaultID {from{transform:translate3d(-100px,0,0);}to{transform:translate3d(100px,0,0);}}',
                rule: 'animation-name: fixationAnimation_defaultID;animation-duration: 0s;',
            },
            scrollAnimation: {
                id: 'scrollAnimation_defaultID',
                keyframe:
                    '@keyframes scrollAnimation_defaultID {from{transform:translate3d(100px,0,0);}to{transform:translate3d(-100px,0,0);}}',
                rule: 'animation-name: scrollAnimation_defaultID;animation-duration: 0s;',
            },
        } as typeof animation);
    });
});
