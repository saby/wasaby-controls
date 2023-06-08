import * as React from 'react';
import { _ListScrollContext } from 'Controls/scroll';
import { Controller } from 'Controls/_horizontalScroll/Controller';

export default React.forwardRef(function ListHorizontalScrollContextConsumer(
    props: object,
    _
): React.ReactElement {
    const context = React.useContext(_ListScrollContext);
    return (
        <props.content
            {...context}
            {...props}
            horizontalScrollControllerCtor={Controller}
        />
    );
});
