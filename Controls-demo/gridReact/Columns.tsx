import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Guid } from 'Types/entity';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { TBorderStyle, TBorderVisibility } from 'Controls/display';

import { getColumns, getItems } from 'Controls-demo/gridReact/resources/Data';

interface IProps {
   borderVisibility?: TBorderVisibility;
   borderStyle?: TBorderStyle;
}

export default React.forwardRef(
   (props: IProps, ref: React.ForwardedRef<HTMLDivElement>) => {
      const items = React.useMemo<RecordSet>(() => {
         return getItems();
      }, []);
      const [columns, setColumns] = React.useState<IColumnConfig[]>(getColumns());

      const addColumn = (index) => {
         setColumns(prevColumns => {
            const newColumns = prevColumns.slice();

            const newColumn: IColumnConfig = {
               key: Guid.create(),
               render: <div>{`new column ${prevColumns.length}`}</div>
            };
            newColumns.splice(index, 0, newColumn);

            return newColumns;
         });
      };

      return (
         <div ref={ref}>
            <div>
               <button onClick={() => {
                  return addColumn(0);
               }}>
                  Add column to start
               </button>
               <button onClick={() => {
                  return addColumn(Math.ceil(columns.length / 2));
               }}>
                  Add column to middle
               </button>
               <button onClick={() => {
                  return addColumn(columns.length);
               }}>
                  Add column to end
               </button>
            </div>

            <GridItemsView
               items={items}
               columns={columns}
            />
         </div>
      );
   }
);
