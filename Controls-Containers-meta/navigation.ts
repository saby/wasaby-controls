import {
    INavigationParams,
    INavigationStrategy,
    TNavigableElement,
    TNavigationDirection,
} from 'FrameEditor/navigation';
import { IItemsOptions } from 'Controls-Containers/interface';

const handleMove = (
    _: TNavigationDirection,
    navigationParams: INavigationParams
): TNavigableElement | null => {
    const { element } = navigationParams;
    if (navigationParams.targetId) {
        return null;
    }
    const variants = element.getStaticProperties()?.variants as IItemsOptions['variants'];
    const children = element.getContentProperties()?.children || [];
    let index = 0;
    if (variants?.items) {
        variants.items.forEach((item, i) => {
            if (item.id === variants.selectedKeys[0]) {
                index = i;
            }
        });
    }
    return children[index].getContentProperties()?.children?.[0]?.getId?.() as TNavigableElement;
};

/**
 * Стратегия навигации виджета Вкладки.
 */
export const tabsNavigationStrategy: INavigationStrategy = {
    moveUp: (navigationParams: INavigationParams) => handleMove('up', navigationParams),
    moveRight: (navigationParams: INavigationParams) => handleMove('right', navigationParams),
    moveDown: (navigationParams: INavigationParams) => handleMove('down', navigationParams),
    moveLeft: (navigationParams: INavigationParams) => handleMove('left', navigationParams),
};
