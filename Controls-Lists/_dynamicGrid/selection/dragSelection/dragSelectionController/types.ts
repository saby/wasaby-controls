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
