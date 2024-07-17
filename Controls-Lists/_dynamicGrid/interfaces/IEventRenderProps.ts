/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { RecordSet } from 'Types/collection';
import { IRowspanProps } from 'Controls/gridReact';

/*
 * @TODO Все интерфейсы и типы из этого файла должны уехать в библиотеку timelineGrid
 */

//  Тут добавляю Range для того, чтобы не было рекурсивной зависимости
export interface IRange {
    start: Date;
    end: Date;
    needScroll?: boolean;
}

export enum Quantum {
    Second = 'second',
    Minute = 'minute',
    Hour = 'hour',
    Day = 'day',
    Month = 'month',
}

export type IQuantum = { name: Quantum; scales: number[] };

/**
 * Тип функции обратного вызова для обработки событий мыши на событиях "Таймлайн Таблицы".
 * Принимает следующие аргументы:
 * * contents: {@link Types/entity:Model} Содержимое записи, для которой вызывается обработчик.
 * * originalEvent: {@link UICommon/Events:SyntheticEvent} Оригинальное событие
 * * eventRecord: {@link Types/entity:Model} Содержимое записи события таймлайна, для которого вызывается обработчик.
 * @typedef {Function} Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/IEventRenderProps/TEventMouseEventCallback
 */
export type TEventMouseEventCallback = (
    contents: Model,
    originalEvent: SyntheticEvent<MouseEvent>,
    eventRecord: Model,
    date: Date,
    target: 'title' | 'body'
) => void;

/**
 * Интерфейс свойств компонента рендеринга события
 * @interface Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/IEventRenderProps
 * @public
 */
export interface IEventRenderProps {
    /**
     * RecordSet с событиями записи
     */
    events: RecordSet;
    /**
     * Запись списка
     */
    item: Model;
    /**
     * Текущее событие
     */
    event: Model;
    /**
     * Ширина события
     */
    width: number;
    /**
     * Отступ контента события
     */
    contentOffset: number;
    /**
     * Левая граница события
     */
    left: number;
    /**
     * Правая граница события
     */
    right: number;
}

/**
 * Режим рендеринга события
 * @typedef {String} Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/IEventRenderProps/TEventRenderViewMode
 * @variant byDuration Событие отображается в соответствии с его продолжительностью от времени начала до времени окончания
 * @variant byGrid Событие отображается растянутым на целое число ячеек таблицы, от ячейки в которой начинается.
 */
export type TEventRenderViewMode = 'byGrid' | 'byDuration';

/**
 * Интерфейс параметров рендеринга события, возвращаемых из {@link Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/IEventRenderProps/TGetEventRenderPropsCallback.typedef коллбека}
 * @interface Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/ICustomEventRenderProps
 * @public
 */
export interface ICustomEventRenderProps extends IRowspanProps {
    /**
     * Режим рендеринга события
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/IEventRenderProps/TEventRenderViewMode.typedef}
     */
    viewMode?: TEventRenderViewMode;
}

/**
 * Коллбек, возвращающий {@link Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/ICustomEventRenderProps параметры для рендеринга события}.
 * Функция принимает Record события.
 * @typedef {Function} Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/IEventRenderProps/TGetEventRenderPropsCallback
 */
export type TGetEventRenderPropsCallback = (item: Model) => ICustomEventRenderProps;

/**
 * Интерфейс свойств компонента "Таймлайн таблица"
 * @interface Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/ITimelineComponentOptions
 * @public
 */
export interface IBaseTimelineGridComponentProps {
    /**
     * Компонент для рендера событий.
     * Принимает в себя компонент, в который будут отданы свойства интерфейса {@link Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/IEventRenderProps}
     * @cfg {React.ReactElement}
     */
    eventRender?: React.ReactElement<IEventRenderProps>;
    /**
     * Функция обратного вызова для получения параметров для рендеринга события.
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/IEventRenderProps/TGetEventRenderPropsCallback.typedef}
     */
    getEventRenderProps?: TGetEventRenderPropsCallback;
    /**
     * Функция обратного вызова при нажатии кнопки мыши на событие динамической сетки.
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/IEventRenderProps/TEventMouseEventCallback.typedef}
     */
    onEventMouseDown?: TEventMouseEventCallback;
    /**
     * Функция обратного вызова при клике на событие динамической сетки.
     * @cfg {Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps/IEventRenderProps/TEventMouseEventCallback.typedef}
     */
    onEventClick?: TEventMouseEventCallback;

    // приватная опция таймлайна
    fixedTimelineDate?: Date;
}

export interface ITimelineComponentEventsProps {
    eventsProperty: string;
    eventStartProperty: string;
    eventEndProperty: string;
}
