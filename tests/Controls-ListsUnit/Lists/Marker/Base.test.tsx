/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import Demo from 'Controls-demo/gridReact/Marker';

describe('Controls-ListsUnit/Lists/Marker/Base', () => {
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

    it('should render marker', () => {
        const { getMarker } = renderGrid(<Demo />, { container });

        expect(getMarker(0)).toBeTruthy();
    });

    it('marker in checkbox cell should be aligned', () => {
        const { getMarker } = renderGrid(<Demo />, { container });

        const marker = getMarker(0);
        expect(marker.matches('.controls-padding_top-grid_s')).toBeTruthy();
    });
});
