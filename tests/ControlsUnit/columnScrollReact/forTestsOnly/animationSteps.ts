import { EdgeState } from 'Controls/_columnScrollReact/common/types';

/* eslint-disable max-len */
export const AnimationSteps = [
    {
        from: 0,
        to: 100,
        leftEdgeState: EdgeState.AnimatedFromVisibleToInvisible,
        rightEdgeState: EdgeState.AnimatedInvisible,
    },
    {
        from: 100,
        to: 200,
        leftEdgeState: EdgeState.AnimatedInvisible,
        rightEdgeState: EdgeState.AnimatedInvisible,
    },
    {
        from: 200,
        to: 300,
        leftEdgeState: EdgeState.AnimatedInvisible,
        rightEdgeState: EdgeState.AnimatedFromInvisibleToVisible,
    },
    {
        from: 300,
        to: 200,
        leftEdgeState: EdgeState.AnimatedInvisible,
        rightEdgeState: EdgeState.AnimatedFromVisibleToInvisible,
    },
    {
        from: 200,
        to: 100,
        leftEdgeState: EdgeState.AnimatedInvisible,
        rightEdgeState: EdgeState.AnimatedInvisible,
    },
    {
        from: 100,
        to: 0,
        leftEdgeState: EdgeState.AnimatedFromInvisibleToVisible,
        rightEdgeState: EdgeState.AnimatedInvisible,
    },
];
/* eslint-enable max-len */
