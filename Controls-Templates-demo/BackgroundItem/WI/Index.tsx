import * as React from 'react';
import BackgroundItemDemo from 'Controls-Templates-demo/BackgroundItem/BackgroundItemDemo';

export default React.forwardRef(function Index(_, ref: React.ForwardedRef<HTMLDivElement>) {
    const showGoodImage = true;

    return (
        <div ref={ref}>
            <BackgroundItemDemo showGoodImage={showGoodImage} />
        </div>
    );
});
