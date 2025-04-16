import * as React from 'react';

const AnimationContext = React.createContext(undefined);

interface IAnimationContainerContextValue {
    animation: { register: Function; startAnimation: Function; stopAnimation: Function };
}

export { AnimationContext, IAnimationContainerContextValue };
