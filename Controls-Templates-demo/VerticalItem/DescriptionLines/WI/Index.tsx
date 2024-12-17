import * as React from 'react';
import DescriptionLinesDemo from 'Controls-Templates-demo/VerticalItem/DescriptionLines/DescriptionLinesDemo';

export default React.forwardRef(function Index(_, ref: React.ForwardedRef<HTMLDivElement>) {
    const showGoodImage = true;

    return (
        <div ref={ref}>
            <DescriptionLinesDemo showGoodImage={showGoodImage} />
        </div>
    );
});
