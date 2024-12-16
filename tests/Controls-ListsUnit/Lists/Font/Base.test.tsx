/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell } from 'Controls-ListsUnit/Lists/GridHelpers';

import FontDemo from 'Controls-demo/gridReact/Font';

describe('Controls-ListsUnit/Lists/Font/Base', () => {
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

    it('should apply fontSize on row and cell', () => {
        const { getItems } = renderGrid(<FontDemo />, { container });

        const items = getItems();
        const cellsFontS = items[0].querySelectorAll('.controls-fontsize-s');
        const cellsFontXL = items[0].querySelectorAll('.controls-fontsize-xl');
        expect(cellsFontS.length).toBe(2);
        expect(cellsFontXL.length).toBe(1);
    });

    it('should apply fontColorStyle on row and cell', () => {
        const { getItems } = renderGrid(<FontDemo />, { container });

        const items = getItems();
        const cellsFontPrimary = items[1].querySelectorAll('.controls-text-primary');
        const cellsFontSecondary = items[1].querySelectorAll('.controls-text-secondary');
        expect(cellsFontPrimary.length).toBe(2);
        expect(cellsFontSecondary.length).toBe(1);
    });

    it('should apply fontWeight on row and cell', () => {
        const { getItems } = renderGrid(<FontDemo />, { container });

        const items = getItems();
        const cellsFontBold = items[2].querySelectorAll('.controls-fontweight-bold');
        const cellsFontNormal = items[2].querySelectorAll('.controls-fontweight-normal');
        expect(cellsFontBold.length).toBe(2);
        expect(cellsFontNormal.length).toBe(1);
    });
});
