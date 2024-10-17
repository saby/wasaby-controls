import * as React from 'react';

export default React.forwardRef(function SearchSeparatorComponentComponent(
    props: {},
    forwardedRef: React.ForwardedRef<HTMLSpanElement>
): JSX.Element {
    return (
        <span
            ref={forwardedRef}
            className="controls-TreeGrid__row__searchSeparator_line_horizontal"
        />
    );
});
