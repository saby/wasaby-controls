import * as React from 'react';
import 'Controls-DataEnv-demo/context/hooks/useConnectedValue/Factory';
import { Text } from 'Controls-Input/inputConnected';

const name = ['field1'];
const name2 = ['field2'];

function Index(_, ref): React.ReactElement {
    return (
        <div className={'tw-contents'} ref={ref}>
            <div className={'tw-flex tw-flex-col'}>
                <div className={'tw-flex tw-flex-col'}>
                    <div>Первое поле:</div>
                    <div className={'tw-flex tw-flex-col'}>
                        <Text name={name} />
                    </div>
                </div>
                <div className={'tw-flex tw-flex-col'}>
                    <div>Второе поле:</div>
                    <div className={'tw-flex tw-flex-col'}>
                        <Text name={name2} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const component = React.forwardRef(Index);

component.getLoadConfig = () => {
    return {
        FormData: {
            dataFactoryName: 'Controls-DataEnv-demo/context/hooks/useConnectedValue/Factory',
            dataFactoryArguments: {},
        },
    };
};
export default component;
