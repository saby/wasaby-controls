export type TResizerVerticalDirection = 'top' | 'bottom';
export type TResizerHorizontalDirection = 'left' | 'right';
export type TResizerDiagonalDirection = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type TResizerDirection =
    | TResizerVerticalDirection
    | TResizerHorizontalDirection
    | TResizerDiagonalDirection;
