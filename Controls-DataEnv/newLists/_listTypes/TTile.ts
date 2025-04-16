import { Model } from 'Types/entity';

export type TImageUrlResolver = (
    width: number,
    height: number,
    url: string,
    item: Model,
    isMenu: boolean
) => string;
export type TTileMode = 'static' | 'dynamic';
export type TTileSize = 's' | 'm' | 'l';
export type TTileOrientation = 'horizontal' | 'vertical';

/**
 * Режим отображения плитки при наведении курсора.
 * @variant none При наведении курсора размер элементов не изменяется.
 * @variant outside При наведении курсора размер элементов увеличивается. Увеличенный элемент находится в окне браузера.
 * @variant inside При наведении курсора размер элементов увеличивается. Увеличенный элемент находится в контроле-контейнере.
 * @variant preview Нет документации, выпишите ошибку.
 * @variant overlap Нет документации, выпишите ошибку.
 */
export type TTileScalingMode = 'none' | 'outside' | 'inside' | 'preview' | 'overlap';
export type TImageFit = 'none' | 'cover' | 'contain';
