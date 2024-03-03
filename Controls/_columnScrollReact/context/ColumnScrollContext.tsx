/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { ISelectorsState } from '../common/selectors';
import { IColumnScrollWidths, IContextWithSelfRef } from '../common/interfaces';
import { EdgeState, TAutoScrollMode, TScrollIntoViewAlign } from '../common/types';

/**
 * Внутренний символ библиотеки.
 * Используется для проверок, что методы позвались из компонентов библиотеки.
 * НИКОГДА не должен экспортироваться из библиотеки.
 * @private
 */
export const PrivateContextUserSymbol = Symbol('PrivateContextUserSymbol');

/**
 * Контекст скролла.
 * @private
 */
export interface IColumnScrollContext
    extends IColumnScrollWidths,
        IContextWithSelfRef<IColumnScrollContext> {
    /**
     * @cfg {Controls/_columnScrollReact/common/types/TAutoScrollMode.typedef} Режим автоподскрола при завершении скроллирования.
     */
    autoScrollMode: TAutoScrollMode;

    /**
     * Принимает значение true на мобильных устройствах.
     */
    isMobile: boolean;

    /**
     * Принимает значение true, если, исходя из размеров контента и области скроллирования, требуется отображение горизонтального скролла.
     */
    isNeedByWidth: boolean;

    /**
     * Состояние, указывающее, что в данный момент контент скролится (инерция или неотрывный touch).
     */
    // Устанавливается зеркалом (MirrorComponent).
    isMobileScrolling: boolean;

    /**
     * Метод обновления состояния IColumnScrollContext.isMobileScrolling
     */
    setIsMobileScrolling: (isMobileScrolling: boolean) => void;

    /**
     * Состояние, указывающее, что в данный происходит перетаскивание скроллбара.
     */
    isScrollbarDragging: boolean;

    /**
     * Метод обновления состояния IColumnScrollContext.isScrollbarDragging.
     */
    setIsScrollbarDragging: (isScrollbarDragging: boolean) => void;

    /**
     * Позиция скролла к которой будет плавно проскролено средствами зеркала на мобильной платформе.
     *
     *  На мобильной платформе недоступна анимация через CSS трансформацию.
     *  Вместо этого, управление напрямую отдается зеркалу с нативным скроллом.
     *  При установке mobileSmoothedScrollPosition зеркало вызывает метод
     *  scrollTo({ left: mobileSmoothedScrollPosition, behavior: 'smooth' })
     *  у своего скроллируемого контейнера. После этого, управление возвращается на
     *  стандартный механизм, как если бы скроллили пальцем.
     *  Зеркало стреляет событиями onScroll пока не закончит перемещение к переданной
     *  раннее позиции и по этому событию пишет в контекст.
     *
     *  Такое лучше всего делать через отдельный стейт, т.к. необходимо, чтобы
     *  вызов плавного скроллирования обработало ТОЛЬКО зеркало, для остальных компонент
     *  это должно быть незаметно, будто ничего не произошло.
     *  Флаг устанавливается только при вызове метода с параметром smooth, дальше он не определен.
     */
    mobileSmoothedScrollPosition?: number;

    /**
     * Текущая позиция скролла.
     */
    position: number;
    /**
     * Метод установки текущей позиции скролла. В отличие от метода IColumnScrollContext.scrollIntoView,
     * позиция устанавливается как есть(за исключением валидации значения, для запрета выхода за границы скролла), игнорируя автоподскрол.
     */
    setPosition: (
        // Новая позиция скролла.
        newPosition: number,
        // Если true, смена позиции произойдет плавно, сопровождаясь анимацией прокрутки.
        smooth?: boolean,
        // Внутренний символ библиотеки. Требуется передача, если метод зовется изнутри библиотеки.
        privateContextUserSymbol?: typeof PrivateContextUserSymbol
    ) => void;

    /**
     * Метод скроллирования к указанной позиции или элементу с учетом автоподскрола(если включен).
     */
    scrollIntoView: (
        // Цель скроллирования, может быть как произвольным скроллируемым элементом внутри области скроллирования,
        // так и конкретной позицией.
        // В случае, если цель является элементом, то расчет границы, к которой стоит проскролить будет браться
        // на основании этого элемента.
        // В случае, если цель является позицией, то итоговая позиция скроллирования будет расчитана на основании целей автоподскрола.
        target: HTMLElement | number,
        // Положение, к которому необходимо проскроллить элемент.
        align?: TScrollIntoViewAlign,
        // Если true, смена позиции произойдет плавно, сопровождаясь анимацией прокрутки.
        smooth?: boolean,
        // Внутренний символ библиотеки. Требуется передача, если метод зовется изнутри библиотеки.
        privateContextUserSymbol?: typeof PrivateContextUserSymbol
    ) => void;

    /**
     * @cfg {Controls/_columnScrollReact/common/types/EdgeState} Состояние левой границы области скроллирования.
     */
    leftEdgeState: EdgeState;
    /**
     * @cfg {Controls/_columnScrollReact/common/types/EdgeState} Состояние правой границы области скроллирования.
     */
    rightEdgeState: EdgeState;

    /**
     * Селекторы элементов скролла.
     */
    SELECTORS: ISelectorsState;

    /**
     * Метод обновления размеров частей скролла.
     */
    updateSizes: (
        // Внутренний символ библиотеки. Требуется передача, если метод зовется изнутри библиотеки.
        privateContextUserSymbol: typeof PrivateContextUserSymbol | null,
        // Новые размеры частей скролла.
        widths: Partial<IColumnScrollWidths>
    ) => void;

    /**
     * Флаг показывающий, что размеры проинициализированы
     */
    isInitializedSizes: boolean;
}

/**
 * Контекст скролла.
 * @private
 */
export const ColumnScrollContext = React.createContext<IColumnScrollContext>(undefined);
ColumnScrollContext.displayName = 'Controls/columnScrollReact:ColumnScrollContext';
