import * as React from 'react';
import ImageItemDemo from 'Controls-Templates-demo/ImageItem/ImageItemDemo';

export default React.forwardRef(function Index(_, ref: React.ForwardedRef<HTMLDivElement>) {
    const showGoodImage = true;

    return (
        <div ref={ref}>
            <ImageItemDemo showGoodImage={showGoodImage} />
        </div>
    );
});
