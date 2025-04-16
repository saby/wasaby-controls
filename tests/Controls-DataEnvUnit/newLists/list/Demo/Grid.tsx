import { Memory } from 'Types/source';
import { Component as GridComponent } from 'Controls-Lists/grid';
import { buildDemo } from 'Controls-DataEnvUnit/newLists/TestEnv/buildDemo';
import { personsData, KEY_PROPERTY } from './Data/personsData';
import { Container as ScrollContainer } from 'Controls/scroll';

export const GRID_QA = 'js-demo-grid-new';

export default buildDemo({
    actions: [
        {
            name: 'Отметить Hilary Osborne (1, команда mark)',
            dataQa: 'markedKey=1',
            action: ({ slice }) => {
                slice.mark(1);
            },
        },
        {
            name: 'Отметить Benjamin Pruitt (3, команда mark)',
            dataQa: 'markedKey=3',
            action: ({ slice }) => {
                slice.mark(3);
            },
        },
        {
            name: 'Отметить Hilary Osborne (1, setState)',
            dataQa: 'markedKey=1,setState',
            action: ({ slice }) => {
                slice.setState({ markedKey: 1 });
            },
        },
        {
            name: 'Отметить Benjamin Pruitt (3, setState)',
            dataQa: 'markedKey=3,setState',
            action: ({ slice }) => {
                slice.setState({ markedKey: 3 });
            },
        },
    ],
    Component: ({ storeId }) => {
        // Оборачиваем временно в контейнер, т.к. наш контрол не умеет строитьс я вне скролла.
        return (
            <ScrollContainer>
                <GridComponent storeId={storeId} dataQa={GRID_QA} />
            </ScrollContainer>
        );
    },
    demoPath: 'Controls-DataEnvUnit/newLists/list/Demo/Grid',
    dataFactoryArguments: {
        collectionType: 'Grid',
        source: new Memory({
            keyProperty: KEY_PROPERTY,
            data: personsData.slice(0, 5),
        }),
        columns: [
            {
                key: 'name',
                displayProperty: 'name',
            },
            {
                key: 'country',
                displayProperty: 'country',
            },
        ],
        keyProperty: KEY_PROPERTY,
    },
});
