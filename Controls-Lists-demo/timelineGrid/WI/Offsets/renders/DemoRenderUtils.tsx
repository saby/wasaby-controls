import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { IDynamicColumnConfig } from 'Controls-Lists/dynamicGrid';
import {
   RangeSelectorConnectedComponent,
   Quantum,
   DateType,
   IHolidaysConfig,
   isWeekendDate,
   IRange
} from 'Controls-Lists/timelineGrid';

import { IStaff } from 'Controls-Lists-demo/timelineGrid/Sources/Data';
import { IDynamic } from 'Controls-Lists-demo/timelineGrid/Sources/generateDynamicColumnsData';

// Demo Renders
import DemoDynamicColumnComponent from './DemoDynamicColumnComponent';
import DemoStaticColumnComponent from './DemoStaticColumnComponent';

export const STORE_ID = 'DemoDynamicGridStore';
export const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';

// Размер вьюпорта
export const VIEWPORT_WIDTH = 757;

// Зафиксированная дата для отображения линии текущего дня
export const FIXED_DATE = new Date(2023, 0, 9, 14);

// функция для демки, позволяющая вернуть диапазон дат для отображения таймлайн таблицы при открытии
export function getInitialRange(): IRange {
   return {
      start: new Date(2023, 0, 1),
      end: new Date(2023, 0, 21)
   };
}

export function getStaticColumns(): IColumnConfig[] {
   return [
      {
         key: 'staticColumn',
         width: '300px',
         render: <DemoStaticColumnComponent />
      }
   ];
}

export interface IGetDynamicColumnParams {
   holidaysData: RecordSet;
   holidaysConfig: IHolidaysConfig;
   quantum?: Quantum;
}

// Конфигурация динамических колонок
export function getDynamicColumn(params: IGetDynamicColumnParams): IDynamicColumnConfig<Date> {
   return {
      displayProperty: 'dynamicTitle',
      minWidth: '20px',
      render: <DemoDynamicColumnComponent />,
      getCellProps: (item: Model<IStaff>, date: Date) => {
         const isDayMode = params.quantum === Quantum.Hour || params.quantum === Quantum.Minute;
         const isYearMode = params.quantum === Quantum.Month;

         // Определяем, входит ли дата в период трудоустройства.
         const isDateWithinWorkPeriod = item.get('startWorkDate').getTime() < date.getTime();
         const borderVisibility = !isDateWithinWorkPeriod ? 'hidden' : 'onhover';
         const borderRadius = isDayMode ? 'null' : 's';
         let isWeekendOrHoliday: boolean;
         if (!isYearMode) {
            // Получаем данные для сотрудника на сгененрированную дату
            const dateStr = formatDate(date, 'YYYY-MM-DD HH:mm:ssZ');
            const dayData = item
               .get(DYNAMIC_COLUMN_DATA_FIELD)
               .getRecordById(dateStr) as Model<IDynamic>;
            // Определяем выходные и рпаздничные дни
            isWeekendOrHoliday =
               isWeekendDate(date, params.holidaysData, params.holidaysConfig) ||
               dayData?.get('dayType') === DateType.Holiday;
         } else {
            isWeekendOrHoliday = false;
         }
         const backgroundStyle = isWeekendOrHoliday
            ? 'schedule_timelineDemo_dayoff'
            : 'schedule_timelineDemo_workday';
         return {
            fontSize: '3xs',
            valign: null,
            backgroundStyle,
            borderVisibility,
            topLeftBorderRadius: borderRadius,
            topRightBorderRadius: borderRadius,
            bottomRightBorderRadius: borderRadius,
            bottomLeftBorderRadius: borderRadius,
            borderStyle: 'default'
         };
      }
   };
}

export function getStaticHeaders(): IHeaderConfig[] {
   return [
      {
         key: 'staticHeader',
         render: (
            <RangeSelectorConnectedComponent
               storeId={STORE_ID}
               fontColorStyle={'primary'}
               fixedDate={FIXED_DATE}
            />
         )
      }
   ];
}

// минимальные ширины колонок
export const dynamicColumnMinWidths = {
   minute: '48px',
   hour: '48px',
   day: '20px',
   month: '53px'
};
