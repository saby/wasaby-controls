/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, isSticked, getCells } from 'Controls-ListsUnit/Lists/GridHelpers';

import Demo from 'Controls-demo/gridReact/StickyCallback';

describe('Controls-ListsUnit/Lists/Sticky/StickyCallback', () => {
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

   it('first item is sticked', () => {
      const { getFirstItem } = renderGrid(
         <Demo/>,
         { container }
      );
      const item = getFirstItem();
      const cells = getCells(item);
      cells.map((cell) => {
         expect(isSticked(cell)).toBeTruthy();
      });
   });
});
