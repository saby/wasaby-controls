import { getTransformCSSRule } from '../common/helpers';

export interface IAnimation {
    id: string;
    keyframe: string;
    rule: string;
}

export function createAnimation(
    animationId: string,
    from: number,
    to: number,
    cssAnimationDuration: string
): {
    scrollAnimation: IAnimation;
    fixationAnimation: IAnimation;
} {
    const scrollAnimationId = `scrollAnimation_${animationId}`;
    const fixationAnimationId = `fixationAnimation_${animationId}`;

    return {
        scrollAnimation: {
            id: scrollAnimationId,
            keyframe: _buildTransformKeyFrame(scrollAnimationId, -from, -to),
            rule: _buildRule(scrollAnimationId, cssAnimationDuration),
        },
        fixationAnimation: {
            id: fixationAnimationId,
            keyframe: _buildTransformKeyFrame(fixationAnimationId, from, to),
            rule: _buildRule(fixationAnimationId, cssAnimationDuration),
        },
    };
}

function _buildTransformKeyFrame(id: string, from: number, to: number): string {
    return (
        `@keyframes ${id} {` +
        `from{${getTransformCSSRule(from)}}` +
        `to{${getTransformCSSRule(to)}}` +
        '}'
    );
}

function _buildRule(animationId: string, animationDuration: string): string {
    return `animation-name: ${animationId};animation-duration: ${animationDuration};`;
}
