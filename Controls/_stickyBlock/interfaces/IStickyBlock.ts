/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import {
    Mode,
    StickyHorizontalPosition,
    StickyShadowVisibility,
    StickyVerticalPosition,
} from 'Controls/_stickyBlock/types';

interface IStickyBlockBase {
    mode?: Mode | Mode[keyof Mode];
    shadowVisibility?: StickyShadowVisibility | StickyShadowVisibility[keyof StickyShadowVisibility];
    subPixelArtifactFix?: boolean;
    pixelRatioBugFix?: boolean;
    backgroundStyle?: string;
    fixedBackgroundStyle?: string;
    fixedZIndex?: number;
    zIndex?: number;
}

export interface IStickyBlock extends IStickyBlockBase {
    position?: StickyVerticalPosition;
    offsetTop?: number;
    onFixed?: Function;
    // Будет ли зафиксирован стики блок сразу при скроллировании, т.е. по сути определяет, лежит ли стики блок сверху
    // скролл контейнера.
    // Опцию пока условно приватная, не описываю в автодоке, тк нужна только в графической шапке, но возможно в будущем
    // понадобится где-то еще.
    // Кейс: под граф шапкой может лежать стики блок, который всегда фиксируется одновременно с основным прилипающим
    // блоком шапки, но рассчитать что он зафиксирован изначально мы не можем, т.к. между ними лежит еще контент.
    initiallyFixed?: boolean;
}

export interface IStickyGroupedBlock extends IStickyBlockBase {
    position?: StickyHorizontalPosition | StickyHorizontalPosition[keyof StickyHorizontalPosition];
    offsetLeft?: number;
}
