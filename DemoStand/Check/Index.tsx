import { forwardRef, LegacyRef, ReactElement } from 'react';

export default forwardRef(function (_, ref: LegacyRef<HTMLDivElement>): ReactElement {
    return <div ref={ref}>It is alive</div>;
});
