import ButtonType from 'Controls-Buttons-meta/buttonConnectedButtonType';
import { Button } from 'Controls-Buttons/buttonConnected';
import { PropsDemoEditor } from 'Controls-demo/ObjectTypeEditor/PropsDemoEditor';
import { Provider as DataContextProvider } from 'Controls-DataEnv/context';
import { RecordSet } from 'Types/collection';
import { actions } from './actions';

function ButtonPropsEditor() {
    const contextConfig = {
        Actions: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                keyProperty: 'id',
                displayProperty: 'commandName',
                groupProperty: 'category',
            },
        },
    };

    const contextData = {
        Actions: {
            items: new RecordSet({
                keyProperty: 'id',
                rawData: actions,
            }),
        },
    };
    return (
        <DataContextProvider configs={contextConfig} loadResults={contextData}>
            <PropsDemoEditor metaType={ButtonType} control={Button} />;
        </DataContextProvider>
    );
}

export default ButtonPropsEditor;
