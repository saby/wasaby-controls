import * as React from 'react';
import { ListScrollContext } from './ListScrollContext';

export default React.forwardRef(function ListScrollContextConsumer(
    props: {
        getContextValue: Function;
    },
    _
): React.ReactElement {
    const context = React.useContext(ListScrollContext);

    React.useEffect(() => {
        if (props.getContextValue) {
            props.getContextValue(context);
        }
    }, [context]);

    return <props.content {...context} {...props} />;
});
