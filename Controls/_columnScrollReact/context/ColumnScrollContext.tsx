import * as React from 'react';
import { ISelectorsState } from '../common/selectors';
import { IColumnScrollWidths, IContextWithSelfRef } from '../common/interfaces';
import { EdgeState } from '../common/types';

// НИКОГДА не экспортировать из библиотеки.
export const PrivateContextUserSymbol = Symbol('PrivateContextUserSymbol');

export interface IColumnScrollContext
    extends IColumnScrollWidths,
        IContextWithSelfRef<IColumnScrollContext> {
    contextRefForHandlersOnly: React.MutableRefObject<IColumnScrollContext>;

    isMobile: boolean;
    isNeedByWidth: boolean;

    // Состояние, указывающее, что в данный момент контент скролится (инерция или неотрывный touch).
    // Устанавливается Зеркалом (MirrorComponent).
    isMobileScrolling: boolean;
    setIsMobileScrolling: (isMobileScrolling: boolean) => void;

    // На мобильной платформе недоступна анимация через CSS трансформацию.
    // Вместо этого, управление напрямую отдается зеркалу с нативным скроллом.
    // При установке mobileSmoothedScrollPosition зеркало вызывает метод
    // scrollTo({ left: mobileSmoothedScrollPosition, behavior: 'smooth' })
    // у своего скроллируемого контейнера. После этого, управление возвращается на
    // стандартный механизм, как если бы скроллили пальцем.
    // Зеркало стреляет событиями onScroll пока не закончит перемещение к переданной
    // раннее позиции и по этому событию пишет в контекст.
    //
    // Такое лучше всего делать через отдельный стейт, т.к. необходимо, чтобы
    // вызов плавного скроллирования обработало ТОЛЬКО зеркало, для остальных компонент
    // это должно быть незаметно, будто ничего не произошло.
    //
    // Флаг устанавливается только при вызове метода с параметром smooth, дальше он не определен.
    mobileSmoothedScrollPosition?: number;

    // Текущая позиция скрола и сеттер на него.
    position: number;
    setPosition: (
        newPosition: number,
        smooth?: boolean,
        privateContextUserSymbol?: typeof PrivateContextUserSymbol
    ) => void;

    leftEdgeState: EdgeState;
    rightEdgeState: EdgeState;

    // Сведу в одно или уберу когда будет сделан GridWithColumnScroll
    SELECTORS: ISelectorsState;

    updateSizes: (
        privateContextUserSymbol: typeof PrivateContextUserSymbol,
        widths: Partial<IColumnScrollWidths>
    ) => void;
}

export const ColumnScrollContext = React.createContext<IColumnScrollContext>(undefined);
ColumnScrollContext.displayName = 'Controls/columnScrollReact:ColumnScrollContext';
