import * as React from 'react';
import HeaderDemo from './Header';

function StickyHeaderDemo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref}>
            <HeaderDemo ref={null} stickyHeader />
        </div>
    );
}

export default React.forwardRef(StickyHeaderDemo);
