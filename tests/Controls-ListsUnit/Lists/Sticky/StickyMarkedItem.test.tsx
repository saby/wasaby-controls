/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, isSticked, getCells } from 'Controls-ListsUnit/Lists/GridHelpers';

import Demo from 'Controls-demo/gridReact/StickyMarkedItem';

describe('Controls-ListsUnit/Lists/Sticky/StickyMarkedItem', () => {
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

   it('not marked item is not sticked', () => {
      const { getFirstItem } = renderGrid(
         <Demo/>,
         { container }
      );
      const cells = getCells(getFirstItem());
      cells.map((cell) => {
         expect(isSticked(cell)).toBeFalsy();
      });
   });

   it('marked item is sticked', async () => {
      const { getFirstItem } = renderGrid(
         <Demo/>,
         { container }
      );

      await userEvent.click(getFirstItem());

      await waitFor(() => {
         const cells = getCells(getFirstItem());
         cells.map((cell) => {
            expect(isSticked(cell)).toBeTruthy();
         });
      });
   });
});
