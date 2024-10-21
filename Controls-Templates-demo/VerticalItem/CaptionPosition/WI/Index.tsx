import * as React from 'react';
import CaptionPositionDemo from 'Controls-Templates-demo/VerticalItem/CaptionPosition/CaptionPositionDemo';

export default React.forwardRef(function Index(_, ref: React.ForwardedRef<HTMLDivElement>) {
    const showGoodImage = true;

    return (
        <div ref={ref}>
            <CaptionPositionDemo showGoodImage={showGoodImage} />
        </div>
    );
});
