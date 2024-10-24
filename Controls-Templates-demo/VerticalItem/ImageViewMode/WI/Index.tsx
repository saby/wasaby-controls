import * as React from 'react';
import ImageViewModeDemo from 'Controls-Templates-demo/VerticalItem/ImageViewMode/ImageViewModeDemo';

export default React.forwardRef(function Index(_, ref: React.ForwardedRef<HTMLDivElement>) {
    const showGoodImage = true;

    return (
        <div ref={ref}>
            <ImageViewModeDemo showGoodImage={showGoodImage} />
        </div>
    );
});
