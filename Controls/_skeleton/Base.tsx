/**
 * @kaizen_zone 35ee8dfe-cff2-40c0-a31b-a8d196994a6b
 */
import { IControlProps } from 'Controls/interface';
import 'css!Controls/skeleton';

/**
 * Интерфейс для базового компонента-скелетон.
 * @interface Controls/skeleton:IBaseSkeleton
 * @public
 */
export interface IBaseSkeletonOptions extends IControlProps {
    active?: boolean;
}

/**
 * Скелетон, позволяющий выводить заглушку произвольного размера и формы.
 *
 * @remark
 * Для того, чтобы задать размеры, необходимо передать имя класса в опцию className, и определить для этого класса набор стилей, таких как ширина, высота, скругление границ
 *
 * @class Controls/skeleton:Base
 *
 * @implements Controls/interface:IControl
 * @implements Controls/skeleton:IBaseSkeleton
 *
 * @public
 * @demo Controls-demo/skeleton/Base/Index
 * @demo Controls-demo/skeleton/Composite/Index
 */
function Base(props: IBaseSkeletonOptions) {
    let className = 'controls-skeleton';
    let bgClassName = 'controls-skeleton__bg';
    if (props.active) {
        bgClassName += ' controls-skeleton_active';
    } else {
        bgClassName += ' controls-skeleton_inactive';
    }
    if (props.className) {
        className += ' ' + props.className;
    }
    return (
        <span className={className}>
            <span className={bgClassName}></span>
        </span>
    );
}

Base.defaultProps = {
    active: false,
};

export default Base;

/**
 * @name Controls/skeleton:IBaseSkeleton#className
 * @cfg {string} Имя класса, которое навесится на корневой контейнер компонента
 * @demo Controls-demo/skeleton/Base/Index
 */

/**
 * @name Controls/skeleton:IBaseSkeleton#active
 * @cfg {boolean} Определяет наличие анимированного фона
 * @default false
 * @demo Controls-demo/skeleton/Base/Index
 */
