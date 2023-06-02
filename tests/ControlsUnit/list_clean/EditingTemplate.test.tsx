/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { EditingTemplate } from 'Controls/list';
import { Collection, CollectionItem } from 'Controls/display';
import { RecordSet } from 'Types/collection';

function getItem(): CollectionItem {
   const collection = new Collection({
      collection: new RecordSet({
         rawData: [{ key: 1 }],
         keyProperty: 'key',
      }),
      keyProperty: 'key'
   });

   return collection.at(0);
}

describe('ControlsUnit/list_clean/EditingTemplate', () => {
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

   it('should not set undefined to title', () => {
      render(
         <EditingTemplate value={undefined} item={getItem()} editorTemplate={<div/>}/>,
         { container }
      );

      const editingComponent = screen.getByTestId('editing_component-view_render');
      expect(editingComponent.getAttribute('title')).toBeNull();
      Array.from(editingComponent.children).forEach((childElement) => {
         expect(childElement.getAttribute('title')).toBeNull();
      });
   });

   it('should not set null to title', () => {
      render(
         <EditingTemplate value={null} item={getItem()} editorTemplate={<div/>}/>,
         { container }
      );

      const editingComponent = screen.getByTestId('editing_component-view_render');
      expect(editingComponent.getAttribute('title')).toBeNull();
      Array.from(editingComponent.children).forEach((childElement) => {
         expect(childElement.getAttribute('title')).toBeNull();
      });
   });
});
