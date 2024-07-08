import { IItemsOptions, ITabsProps } from 'Controls-Containers/interface';
import { EditingElementFacade, IEditingElementFacade } from 'FrameEditor/base';
import { RUNTIME_WIDGET_NAMES } from 'FrameEditorConverter/constants';

function getChildrenElement() {
    const createChildren = (): IEditingElementFacade => {
        return new EditingElementFacade({
            type: RUNTIME_WIDGET_NAMES.layout,
            contentProperties: {
                children: [
                    new EditingElementFacade({
                        type: RUNTIME_WIDGET_NAMES.paragraph,
                        contentProperties: {
                            children: [
                                new EditingElementFacade({
                                    type: RUNTIME_WIDGET_NAMES.formatted,
                                    staticProperties: {
                                        formats: [[0, 0, {}]],
                                    },
                                }),
                            ],
                        },
                    }),
                ],
            },
        });
    };

    return new EditingElementFacade({
        type: 'Controls-Containers/Tab:View',
        staticProperties: {
            selectable: false,
        },
        contentProperties: {
            children: [createChildren()],
        },
    });
}

export function changeHandler(
    prevValue: IEditingElementFacade<IItemsOptions>,
    nextValue: IEditingElementFacade<IItemsOptions>
) {
    const staticProperties = nextValue.getStaticProperties<IItemsOptions>() || {};
    const prevVariants = prevValue.getStaticProperties<IItemsOptions>()
        .variants as IItemsOptions['variants'];
    const nextVariants = staticProperties.variants as IItemsOptions['variants'];
    let isChildrenChanged = false;
    const changedChildren = [...(nextValue.getContentProperties<ITabsProps>().children || [])];
    const nextItemsCount = nextVariants?.items?.length || 0;
    const prevItemsCount = prevVariants?.items?.length || 0;

    let result = nextValue;

    if (prevItemsCount !== nextItemsCount) {
        isChildrenChanged = true;
        if (prevItemsCount < nextItemsCount) {
            for (let i = 0; i < nextItemsCount - prevItemsCount; i++) {
                if (changedChildren.length < nextItemsCount) {
                    // Вставляем пустой виджет
                    changedChildren.push(getChildrenElement());
                    if (i === 0 && prevItemsCount === 0) {
                        staticProperties.variants = {
                            selectedKeys: [staticProperties.variants?.items?.[0]?.id],
                            items: staticProperties.variants?.items,
                        };
                    }
                }
            }
        } else {
            let childernIndex = 0;
            prevVariants.items.forEach((item, index) => {
                const nextItems = nextVariants?.items || [];
                const isFind = nextItems.find((nItem) => {
                    return nItem.id === item.id;
                });
                if (!isFind) {
                    changedChildren.splice(childernIndex, 1);
                    if (item.id === staticProperties.variants?.selectedKeys[0]) {
                        staticProperties.variants = {
                            selectedKeys: [staticProperties.variants?.items?.[0]?.id],
                            items: staticProperties.variants?.items,
                        };
                    }
                } else {
                    childernIndex++;
                }
            });
        }
    } else if (
        prevVariants?.items &&
        nextVariants?.items &&
        prevVariants.items !== nextVariants.items
    ) {
        for (let index = 0; index < prevVariants.items.length; index++) {
            const item = prevVariants.items[index];
            if (item.id !== nextVariants.items[index].id) {
                const newIndex = nextVariants.items.findIndex((fItem) => {
                    return fItem.id === item.id;
                });
                if (newIndex !== -1) {
                    const tmpChildren = changedChildren[index];
                    changedChildren[index] = changedChildren[newIndex];
                    changedChildren[newIndex] = tmpChildren;
                    isChildrenChanged = true;
                    break;
                }
            }
        }
    }

    // При 1 входе значение приходит по умолчанию и оно undefined, хотя по факту есть 1 элемент.
    // Поэтому на всякий случай добавляем 1 ребенка если его нет
    if (typeof nextVariants === 'undefined' && !changedChildren.length) {
        changedChildren.push(getChildrenElement());
        isChildrenChanged = true;
    }

    if (!changedChildren.length && nextVariants?.items?.length) {
        for (let i = 0; i < nextVariants.items.length; i++) {
            // Вставляем пустой виджет
            changedChildren.push(getChildrenElement());
            isChildrenChanged = true;
        }
    }

    if (changedChildren.length) {
        /**
         * На случай, если удалили содержимое у виджета вкладка.
         * Если удалили содержимое, то заново его пересоздаем.
         * Примерно также сделано в таблицах, только там на каждый рендер происходит пересоздание
         */
        changedChildren.forEach((editingElement, index) => {
            const editingElementChildren = editingElement?.getContentProperties?.()?.children;
            if (!editingElementChildren?.length) {
                changedChildren[index] = getChildrenElement();
                isChildrenChanged = true;
            }
        });
    }

    if (staticProperties?.variants?.items) {
        const isFind = staticProperties.variants.items.findIndex((fItem) => {
            return fItem.id === staticProperties.variants.selectedKeys[0];
        });
        if (isFind === -1) {
            staticProperties.variants.selectedKeys = [staticProperties.variants.items[0].id];
            isChildrenChanged = true;
        }
    }

    if (isChildrenChanged) {
        result = result.modify({
            staticProperties: {
                ...staticProperties,
            },
            contentProperties: {
                children: changedChildren,
            },
        });
    }

    return result;
}
