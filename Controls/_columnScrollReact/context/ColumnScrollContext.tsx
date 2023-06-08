import * as React from 'react';
import { ISelectorsState } from '../common/selectors';
import { IColumnScrollWidths } from '../common/interfaces';
import { EdgeState } from '../common/types';

export interface IColumnScrollContext extends IColumnScrollWidths {
    contextRefForHandlersOnly: React.MutableRefObject<IColumnScrollContext>;

    isMobile: boolean;
    isNeedByWidth: boolean;

    // Состояние, указывающее, что в данный момент контент скролится (инерция или неотрывный touch).
    // Устанавливается Зеркалом (MirrorComponent).
    isMobileScrolling: boolean;
    setIsMobileScrolling: (isMobileScrolling: boolean) => void;

    // Текущая позиция скрола и сеттер на него.
    position: number;
    setPosition: (newPosition: number, smooth?: boolean) => void;

    columnScrollStartPosition: number | 'end';

    leftEdgeState: EdgeState;
    rightEdgeState: EdgeState;

    // Сведу в одно или уберу когда будет сделан GridWithColumnScroll
    SELECTORS: ISelectorsState;

    // Уберу когда будет сделан GridWithColumnScroll и ресайз
    updateSizes: () => void;
}

export const ColumnScrollContext =
    React.createContext<IColumnScrollContext>(undefined);
ColumnScrollContext.displayName =
    'Controls/columnScrollReact:ColumnScrollContext';
