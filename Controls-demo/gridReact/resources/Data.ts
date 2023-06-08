import { RecordSet } from 'Types/collection';
import { IColumnConfig } from 'Controls/gridReact';

export function getData(): object[] {
   return [
      {
         key: 0,
         number: 1,
         country: 'Россия',
         capital: 'Москва'
      },
      {
         key: 1,
         number: 2,
         country: 'Канада',
         capital: 'Оттава'
      },
      {
         key: 2,
         number: 3,
         country: 'Соединенные Штаты Америки',
         capital: 'Вашингтон'
      }
   ];
}

export function getItems(): RecordSet {
   return new RecordSet({
      rawData: getData(),
      keyProperty: 'key'
   });
}

export function getColumns(): IColumnConfig[] {
    // key чтобы прошла проверка isReactView
    return [
        { key: 'number', displayProperty: 'number' },
        { displayProperty: 'country' },
        { displayProperty: 'capital' },
    ];
}
