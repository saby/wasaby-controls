/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import Demo from 'Controls-demo/treeGridReact/Base';

describe('Controls-ListsUnit/Lists/Font/NodesFontSize', () => {
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

    it('should use 2xl fontSize for node', () => {
        const { getItems } = renderGrid(<Demo />, { container });

        const items = getItems();
        const node = items[0];
        const cellsFont2XL = node.querySelectorAll('.controls-fontsize-2xl');
        expect(cellsFont2XL.length).toBe(3);
    });

    it('should use xl fontSize for ршввут node', () => {
        const { getItems } = renderGrid(<Demo />, { container });

        const items = getItems();
        const hiddenNode = items[3];
        const cellsFont2XL = hiddenNode.querySelectorAll(
            '.controls-fontsize-xl'
        );
        expect(cellsFont2XL.length).toBe(3);
    });
});
