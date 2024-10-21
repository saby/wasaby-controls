import * as React from 'react';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { TInternalProps } from 'UICore/Executor';
import { IItemAction } from 'Controls/interface';
import {
   getActionsForContacts as getItemActions
} from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

const { getData } = Tasks;

const columns: IColumn[] = Tasks.getDefaultColumns();

const itemActions: IItemAction[] = getItemActions();

// Демка для тестирования случая, когда в гриде есть опции записи в "outside", кнопка подгрузки записей и группировка.
// 1. Не должно быть двойных футеров. Под таблицей должен быть один отступ под ItemActions.
// 2. При сворачивании всех групп не должна пропадать кнопка "Ещё".
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
   const scrollAttrs = {
      style: {
         height: '550px',
         width: '330px'
      }
   };
   return (
      <div className='controlsDemo__wrapper' ref={ref}>
         <ScrollContainer {...scrollAttrs}>
            <GridView
               storeId='NavigationDemandWithGroups'
               columns={columns}
               itemActions={itemActions}
               itemActionsPosition='outside'
               groupProperty='fullName' />
         </ScrollContainer>
      </div>

   );
}

export default Object.assign(React.forwardRef(Demo), {
   getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
      return {
         NavigationDemandWithGroups: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
               displayProperty: 'title',
               source: new Memory({
                  keyProperty: 'key',
                  data: getData()
               }),
               navigation: {
                  source: 'page',
                  view: 'demand',
                  sourceConfig: {
                     pageSize: 3,
                     page: 0,
                     hasMore: false
                  },
                  viewConfig: {
                     pagingMode: 'basic'
                  }
               }
            }
         }
      };
   }
});
