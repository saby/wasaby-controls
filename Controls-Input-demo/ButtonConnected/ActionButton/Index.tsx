import { useMemo, forwardRef } from 'react';

import ButtonType from 'Controls-Input-meta/buttonConnectedButtonType';
import { Button } from 'Controls-Input/buttonConnected';
import { PropsDemoEditor } from 'Controls-demo/ObjectTypeEditor/PropsDemoEditor';
import { Provider as DataContextProvider } from 'Controls-DataEnv/context';
import { RecordSet } from 'Types/collection';
import { actions } from './actions';

const ButtonPropsEditor = forwardRef((_, ref) => {
    const contextConfig = useMemo(() => {
        return {
            Actions: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    keyProperty: 'id',
                    displayProperty: 'commandName',
                    groupProperty: 'category',
                },
            },
        };
    }, []);

    const contextData = useMemo(() => {
        return {
            Actions: {
                items: new RecordSet({
                    keyProperty: 'id',
                    rawData: actions,
                }),
            },
        };
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper tw-flex tw-flex-col">
            <DataContextProvider configs={contextConfig} loadResults={contextData}>
                <PropsDemoEditor metaType={ButtonType} control={Button} />
            </DataContextProvider>
        </div>
    );
});

export default ButtonPropsEditor;
