import * as React from 'react';
import ImageEffectDemo from 'Controls-Templates-demo/VerticalItem/ImageEffect/ImageEffectDemo';

export default React.forwardRef(function Index(_, ref: React.ForwardedRef<HTMLDivElement>) {
    const showGoodImage = false;

    return (
        <div ref={ref}>
            <ImageEffectDemo showGoodImage={showGoodImage} />
        </div>
    );
});
