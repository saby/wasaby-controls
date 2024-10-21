import * as React from 'react';

import { MyConnectedComponent } from './MyConnectedComponent';
import { MyConnectedToolbar } from './MyConnectedToolbar';
import 'css!Controls-DataEnv-demo/slice/CustomDemo/Styles';

export function Index(props): JSX.Element {
    return (
        <>
            <MyConnectedComponent />
            <MyConnectedToolbar />
        </>
    );
}

Index.getLoadConfig = () => {
    return {
        expandedSlice: {
            dataFactoryName: 'Controls-DataEnv-demo/slice/CustomDemo/MyFactory',
            dataFactoryArguments: {},
        },
    };
};

export default Index;
