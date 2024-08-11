/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
export type TPoint = {
    x: number;
    y: number;
};

export type TRectParams = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type TRect = Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>;
