/**
 * @kaizen_zone 35ee8dfe-cff2-40c0-a31b-a8d196994a6b
 */
import { default as Base, IBaseSkeletonOptions } from 'Controls/_skeleton/Base';
import 'css!Controls/skeleton';

interface IImageSkeletonOptions extends IBaseSkeletonOptions {
    size?: string;
    borderRadius?: string;
}

/**
 * Скелетон, позволяющий выводить заглушку заменяющую изображение или иконку.
 *
 * @class Controls/skeleton:Image
 *
 * @implements Controls/interface:IControl
 * @implements Controls/skeleton:IBaseSkeleton
 *
 * @public
 * @demo Controls-demo/skeleton/Image/Index
 * @demo Controls-demo/skeleton/Composite/Index
 */
function Image(props: IImageSkeletonOptions) {
    let className =
        'controls-skeleton-image_size-' +
        props.size +
        ' controls-skeleton-image_radius-' +
        props.borderRadius;
    if (props.className) {
        className += ' ' + props.className;
    }

    const baseSkeletonProps = {
        ...props,
        className,
    };

    return <Base {...baseSkeletonProps}></Base>;
}

Image.defaultProps = {
    size: 'm',
    borderRadius: 'full',
    active: false,
};

export default Image;

/**
 * @name Controls/skeleton:Image#size
 * @cfg {string} Высота/ширина заменяемой картинки
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant xlt
 * @variant 2xl
 * @variant 3xl
 * @variant 4xl
 * @variant 5xl
 * @default m
 * @demo Controls-demo/skeleton/Image/Index
 */

/**
 * @name Controls/skeleton:Image#borderRadius
 * @cfg {boolean} Радиус скругления заглушки.
 * @variant null - без скругления
 * @variant 3xs
 * @variant 2xs
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant xlt
 * @variant 2xl
 * @variant 3xl
 * @variant full - скругление равное половине размера заглушки (используется для получения формы круга)
 * @default full
 * @demo Controls-demo/skeleton/Text/Index
 */
