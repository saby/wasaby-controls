import { Memory } from 'Types/source';
import { buildDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import { personsData, KEY_PROPERTY } from './Data/personsData';
import { View as ListComponent } from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';

const DISPLAY_PROPERTY = 'name';

export default buildDemo({
    Component: ({ storeId }) => {
        return (
            <ScrollContainer>
                <ListComponent storeId={storeId} />
            </ScrollContainer>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/ListOld_WrongSlice',
    getDataFactoryArguments: () => ({
        source: new Memory({
            keyProperty: KEY_PROPERTY,
            data: personsData.slice(0, 5),
        }),
        keyProperty: KEY_PROPERTY,
        displayProperty: DISPLAY_PROPERTY,
        searchParam: DISPLAY_PROPERTY,
    }),
});
