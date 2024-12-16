import * as React from 'react';
import ImagePositionDemo from 'Controls-Templates-demo/VerticalItem/ImagePosition/ImagePositionDemo';

export default React.forwardRef(function Index(_, ref: React.ForwardedRef<HTMLDivElement>) {
    const showGoodImage = false;

    return (
        <div ref={ref}>
            <ImagePositionDemo showGoodImage={showGoodImage} />
        </div>
    );
});
