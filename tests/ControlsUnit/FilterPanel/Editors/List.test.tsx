/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render, screen } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';
import { View } from 'Controls/filterPanel';
import { Memory } from 'Types/source';
import { NewSourceController } from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';

describe('Controls/filterPanel:View', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    it('emptyText renders correctly', async () => {
        const sourceController = new NewSourceController({
            source: new Memory(),
        });
        sourceController.setItems(new RecordSet());
        const filterDescription = [
            {
                name: 'owner',
                emptyText: 'Все сотрудники',
                emptyKey: null,
                value: null,
                resetValue: null,
                sourceController,
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                editorOptions: {
                    keyProperty: 'id',
                    displayProperty: 'title',
                    source: new Memory({
                        data: [],
                        keyProperty: 'id',
                    }),
                    sourceController,
                },
            },
        ];

        render(<View source={filterDescription} />, { container });

        const emptyText = await screen.findByText('Все сотрудники');
        expect(emptyText).toBeDefined();
    });
});
