/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
export type TResizerVerticalDirection = 'top' | 'bottom';
export type TResizerHorizontalDirection = 'left' | 'right';
export type TResizerDiagonalDirection = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type TResizerDirection =
    | TResizerVerticalDirection
    | TResizerHorizontalDirection
    | TResizerDiagonalDirection
    | 'none';
