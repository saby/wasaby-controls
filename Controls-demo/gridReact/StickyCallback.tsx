import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { getItems } from './resources/StickyDemoData';

function StickyCallbackDemo(
   props: TInternalProps,
   ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
   const items = React.useMemo<RecordSet>(() => {
      return getItems();
   }, []);
   const columns = React.useMemo<IColumnConfig[]>(() => {
      return [
         {
            key: 'key',
            displayProperty: 'key',
            width: '50px',
         },
         {
            key: 'country',
            displayProperty: 'country',
         },
      ];
   }, []);
   const stickyCallback = React.useCallback((item: Model) => {
      const isSticked = item.get<string>('country').includes('sticked');
      if (isSticked) {
         return 'topBottom';
      }
   }, []);

   return (
      <div ref={ref} className={'controlsDemo__wrapper'}>
         <ScrollContainer
            className={'controlsDemo__height500 controlsDemo__width800px'}
         >
            <GridView
               columns={columns}
               items={items}
               stickyCallback={stickyCallback}
            />
         </ScrollContainer>
      </div>
   );
}

export default React.forwardRef(StickyCallbackDemo);
