import * as React from 'react';
import VerticalItemDemo from 'Controls-Templates-demo/VerticalItem/VerticalItemDemo';

export default React.forwardRef(function Index(_, ref: React.ForwardedRef<HTMLDivElement>) {
    const showGoodImage = false;
    return (
        <div ref={ref}>
            <VerticalItemDemo showGoodImage={showGoodImage} />
        </div>
    );
});
