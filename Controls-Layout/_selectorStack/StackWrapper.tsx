import { forwardRef } from 'react';
import { Provider } from 'Controls-DataEnv/context';
import { Stack } from 'Controls-Layout/_selectorStack/Stack';

// @ts-ignore
const StackWrapper = forwardRef((props, ref) => {
    return (
        <Provider configs={props._configs} loadResults={props._loadResult}>
            <Stack />
        </Provider>
    );
});

export default StackWrapper;
