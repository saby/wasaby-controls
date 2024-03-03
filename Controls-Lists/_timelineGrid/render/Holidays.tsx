/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
 */
import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Logger } from 'UICommon/Utils';
import { InfoboxTarget } from 'Controls/popupTargets';
import { date as formatDate } from 'Types/formatter';
import { Icon } from 'Controls/icon';

export const HOLIDAY_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Конфигурация для определения и вывода праздничных и выходных дней.
 * @interface Controls-Lists/_timelineGrid/render/Holidays/IHolidaysConfig
 * @public
 */
export interface IHolidaysConfig {
    /**
     * Название свойства мета данных, в котором расположен RecordSet, содержащеий выходные и праздничные дни.
     */
    calendarProperty: string;

    /**
     * Название свойства записи праздников, содержащего дату в формате ГГГГ-ММ-ДД.
     */
    dateProperty: string;

    /**
     * Название свойства записи праздников, содержащего тип дня - выходной или рабочий день.
     */
    dayTypeProperty: string;

    /**
     * Название свойства записи праздников, содержащего массив праздников.
     */
    holidaysProperty: string;
}

type THolidaysCalendarItem = Model;
type THolidaysCalendar = RecordSet;

interface IHolidaysProps {
    holidays: IHoliday[];
}

interface IBaseHolidayComponentProps {
    view: 'circle' | 'info-icon';
    className?: string;
    children?: React.ReactChildren;
}

interface IHolidayComponentProps extends IBaseHolidayComponentProps, IHolidaysProps {}

interface IHolidayConnectedComponentProps extends IBaseHolidayComponentProps {
    date: Date;
}

export interface IHolidaysContextValue {
    holidaysCalendar: THolidaysCalendar;
    holidaysConfig: IHolidaysConfig;
}

/**
 * Тип дня в "Таймлайн таблице".
 * @typedef Controls-Lists/_timelineGrid/render/Holidays/DateType
 * @variant 0 Рабочий день
 * @variant 1 Конец недели
 * @variant 2 Праздничный день
 * @variant 3 Предпраздничный день
 */
export enum DateType {
    WorkDay,
    Weekend,
    Holiday,
    PreHoliday,
}

/**
 * Интерфейс объекта с описанием праздничного дня
 * @interface Controls-Lists/_timelineGrid/render/Holidays/IHoliday
 * @public
 */
export interface IHoliday {
    /**
     * Название праздника
     */
    Name: string;
    /**
     * Краткое описание праздника
     */
    Description: string;
}

function validateHoliday(holiday: IHoliday): void {
    if (!holiday.hasOwnProperty('Name')) {
        Logger.error('Неверный формат объекта, описывающего праздник. Отсутствует поле Name');
    }
    if (!holiday.hasOwnProperty('Description')) {
        Logger.error(
            'Неверный формат объекта, описывающего праздник. Отсутствует поле Description'
        );
    }
}

function HolidaysTooltipComponent({ holidays }: IHolidaysProps) {
    return holidays.map((holiday) => {
        validateHoliday(holiday);
        return (
            <React.Fragment key={holiday.Name}>
                <div className={'controls-fontsize-m ws-ellipsis controls-InfoBox__message_margin'}>
                    {holiday.Name}
                </div>
                {holiday.Description && (
                    <div className={'controls-fontsize-xs controls-text-label ws-ellipsis'}>
                        {holiday.Description}
                    </div>
                )}
            </React.Fragment>
        );
    });
}

function HolidayComponent(props: IHolidayComponentProps) {
    const popupTemplate = <HolidaysTooltipComponent holidays={props.holidays} />;

    let indicator = null;
    if (props.view === 'circle') {
        indicator = (
            <div
                className={`ControlsLists-timelineGrid__HolidayComponent-circle ${
                    props.className || ''
                }`}
            />
        );
    } else if (props.view === 'info-icon') {
        indicator = (
            <Icon
                icon={'icon-Info'}
                iconSize={'s'}
                iconStyle={'unaccented'}
                className={'ControlsLists-timelineGrid__HolidayComponent-iconInfo'}
            />
        );
    } else {
        Logger.error('Prop "view" must be defined.');
    }

    const content = props.children ? (
        <div className={'tw-flex tw-items-center tw-w-full tw-h-full tw-justify-center'}>
            {props.children}
            {indicator}
        </div>
    ) : (
        indicator
    );

    return (
        <InfoboxTarget template={popupTemplate} alignment={'center'} targetSide={'bottom'}>
            {content}
        </InfoboxTarget>
    );
}

export const HolidaysContext = React.createContext<IHolidaysContextValue>(null);

export function HolidayConnectedComponent(props: IHolidayConnectedComponentProps) {
    const { holidaysCalendar, holidaysConfig } = React.useContext(HolidaysContext);
    const isHoliday = isHolidayDate(props.date, holidaysCalendar, holidaysConfig);
    if (!isHoliday) {
        return props.children || null;
    }

    const holidayData = getHolidaysCalendarItem(props.date, holidaysCalendar, holidaysConfig);
    const holidays = holidayData.get(holidaysConfig.holidaysProperty) as IHoliday[];

    return (
        <HolidayComponent
            children={props.children}
            view={props.view}
            className={props.className}
            holidays={holidays}
        />
    );
}

/**
 * Считает значение для контекста с выходными.
 * @param items
 * @param holidaysConfig
 */
export function useHolidaysContextValueProvider(
    items: RecordSet,
    holidaysConfig: IHolidaysConfig
): IHolidaysContextValue {
    // Если на стороне БЛ ограничили права на вызов метода,
    // То Items будет undefined и должна отобразиться "дружелюбная ошибка".
    // Но таймлайн всё равно будет пытаться отрисоваться, поэтому тут нужна проверка на items.
    const holidaysCalendar = items?.getMetaData()[holidaysConfig?.calendarProperty] as RecordSet;
    if (items && holidaysConfig?.calendarProperty && !holidaysCalendar) {
        Logger.error('Настроен вывод выходных и праздников, но данные не загружены.');
    }
    return React.useMemo(() => {
        // При отсутствии items возвращаем пустой объект.
        if (!items) {
            return {} as IHolidaysContextValue;
        }

        // https://online.saby.ru/opendoc.html?guid=8c291cf4-96f4-442e-8186-e1020b07a373&client=3
        if (holidaysCalendar) {
            holidaysCalendar.setKeyProperty(holidaysConfig.dateProperty);
        }

        return {
            holidaysConfig,
            holidaysCalendar,
        };
    }, [holidaysConfig, holidaysCalendar, items]);
}

/**
 * Определяет, является ли дата выходным днем
 * @param date
 */
export function useWeekendDate(date: Date): boolean {
    const { holidaysCalendar, holidaysConfig } = React.useContext(HolidaysContext);

    return React.useMemo(() => {
        return isWeekendDate(date, holidaysCalendar, holidaysConfig);
    }, [date, holidaysCalendar, holidaysConfig]);
}

export function weekendFilter(date: Date): boolean {
    return date.getDay() % 6 !== 0;
}

/**
 * Функция позволяет определить, я вляется ли переданная дата выходоным днём в календаре праздников.
 * @param date Дата
 * @param holidaysCalendar календарь, RecordSet с праздниками
 * @param config конфигурация календаря праздников
 */
export function isWeekendDate(
    date: Date,
    holidaysCalendar: RecordSet,
    config: IHolidaysConfig
): boolean {
    const holidayData = getHolidaysCalendarItem(date, holidaysCalendar, config);
    if (!holidayData) {
        return false;
    }
    const dayType = holidayData.get(config.dayTypeProperty) as DateType;
    return dayType !== DateType.WorkDay && dayType !== DateType.PreHoliday;
}

function isHolidayDate(
    date: Date,
    holidaysCalendar: THolidaysCalendar,
    config: IHolidaysConfig
): boolean {
    const holidayData = getHolidaysCalendarItem(date, holidaysCalendar, config);
    if (!holidayData) {
        return false;
    }
    const holidays = holidayData.get(config.holidaysProperty) as IHoliday[];
    return !!(holidays && holidays.length);
}

function getHolidaysCalendarItem(
    date: Date,
    holidaysCalendar: THolidaysCalendar,
    config: IHolidaysConfig
): THolidaysCalendarItem {
    if (!config) {
        return null;
    }
    const dateStr = formatDate(date, HOLIDAY_DATE_FORMAT);
    const itemIndex = holidaysCalendar.getIndexByValue(config.dateProperty, dateStr);
    return holidaysCalendar.at(itemIndex);
}
