/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCells } from 'Controls-ListsUnit/Lists/GridHelpers';

import Demo from 'Controls-demo/gridReact/Columns';

describe('Controls-ListsUnit/Lists/Columns/ChangingInGrid', () => {
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

   it('should add column to start', async() => {
      const { getFirstItem } = renderGrid(<Demo/>, { container });

      await userEvent.click(screen.getByText('Add column to start'));

      await waitFor(() => {
         const item = getFirstItem();
         const cells = getCells(item);
         expect(cells.length).toBe(4);
         expect(cells[0].textContent).toBe('new column 3');
      });
   });

   it('should add column to middle', async() => {
      const { getFirstItem } = renderGrid(<Demo/>, { container });

      await userEvent.click(screen.getByText('Add column to middle'));

      await waitFor(() => {
         const item = getFirstItem();
         const cells = getCells(item);
         expect(cells.length).toBe(4);
         expect(cells[2].textContent).toBe('new column 3');
      });
   });

   it('should add column to end', async() => {
      const { getFirstItem } = renderGrid(<Demo/>, { container });

      await userEvent.click(screen.getByText('Add column to end'));

      await waitFor(() => {
         const item = getFirstItem();
         const cells = getCells(item);
         expect(cells.length).toBe(4);
         expect(cells[3].textContent).toBe('new column 3');
      });
   });
});
