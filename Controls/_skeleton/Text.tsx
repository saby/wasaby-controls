/**
 * @kaizen_zone 35ee8dfe-cff2-40c0-a31b-a8d196994a6b
 */
import { default as Base, IBaseSkeletonOptions } from 'Controls/_skeleton/Base';
import 'css!Controls/skeleton';

interface ITextSkeletonOptions extends IBaseSkeletonOptions {
    rows?: number;
    fontSize?: string;
}

/**
 * Скелетон, позволяющий выводить заглушку заменяющую текст.
 *
 * @class Controls/skeleton:Text
 *
 * @implements Controls/interface:IControl
 * @implements Controls/skeleton:IBaseSkeleton
 *
 * @public
 * @demo Controls-demo/skeleton/Text/Index
 * @demo Controls-demo/skeleton/Composite/Index
 */
function Text(props: ITextSkeletonOptions) {
    let elemClassName =
        'controls-skeleton-text' + ' controls-skeleton-text-' + props.fontSize;
    const rows = props.rows;
    const skeletonsList = [];

    for (let i = 0; i < rows; i++) {
        if (rows > 1 && i === rows - 1) {
            elemClassName += ' controls-skeleton-text_last';
        }
        const baseSkeletonProps = {
            ...props,
            className: elemClassName,
            key: i,
        };
        skeletonsList.push(<Base {...baseSkeletonProps}></Base>);
    }

    return <div className={props.className}>{skeletonsList}</div>;
}

Text.defaultProps = {
    rows: 1,
    fontSize: 'm',
    active: false,
};

export default Text;

/**
 * @name Controls/skeleton:Text#rows
 * @cfg {number} Количество выводимых строк.
 * @default 1
 * @remark Используйте больше строк, если размер предполагаемого абзаца с текстом будет большим.
 * @demo Controls-demo/skeleton/Text/Index
 */

/**
 * @name Controls/skeleton:Text#fontSize
 * @cfg {string} Размер текста, вместо которого выводится заглушка
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @default m
 * @demo Controls-demo/skeleton/Text/Index
 */
