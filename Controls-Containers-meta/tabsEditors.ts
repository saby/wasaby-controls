import { IItemsOptions, ITabsProps } from 'Controls-Containers/interface';
import { EditingElementFacade, IEditingElementFacade } from 'FrameEditor/base';

function getChildrenElement() {
    const createReplacer = (): IEditingElementFacade => {
        return new EditingElementFacade({ type: 'FrameControls/columnsLayout:Replacer' });
    };

    return new EditingElementFacade({
        type: 'Controls-Containers/Tab:View',
        contentProperties: {
            children: [
                new EditingElementFacade({
                    type: 'FrameControls/columnsLayout:View',
                    staticProperties: {
                        itemsWidth: [
                            {
                                type: 'proportion',
                                value: 60,
                            },
                            {
                                type: 'proportion',
                                value: 60,
                            },
                        ],
                    },
                    contentProperties: {
                        children: [createReplacer(), createReplacer()],
                    },
                }),
            ],
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
                }
            }
        } else {
            prevVariants.items.forEach((item, index) => {
                if (item.id !== nextVariants.items[index]?.id) {
                    changedChildren.slice(index, 1);
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
                    const tmpChildren = { ...changedChildren[index] };
                    changedChildren[index] = { ...changedChildren[newIndex] };
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
