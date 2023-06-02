/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import Demo from 'Controls-demo/gridReact/UseRenderData';

describe('Controls-ListsUnit/Lists/Hooks/UseRenderData', () => {
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

   it('should return item - record and renderValues by passed properties', () => {
      const { getFirstItem } = renderGrid(<Demo/>, {
         container,
      });

      const item = getFirstItem();
      // Проверяем что демка построилась, что у рекорда взяли ключ(0) и
      // что renderValues правильно посчитались по переданным свойствам
      expect(item.textContent)
         .toBe('0РоссияМосква');
   });
});
