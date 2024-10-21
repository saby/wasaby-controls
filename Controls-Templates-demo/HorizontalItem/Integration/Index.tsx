import * as React from 'react';
import HorizontalItemDemo from 'Controls-Templates-demo/HorizontalItem/HorizontalItemDemo';

export default React.forwardRef(function Index(_, ref: React.ForwardedRef<HTMLDivElement>) {
    const showGoodImage = false;

    return (
        <div ref={ref}>
            <HorizontalItemDemo showGoodImage={showGoodImage} />
        </div>
    );
});
