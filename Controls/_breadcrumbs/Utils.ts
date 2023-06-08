/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Record, Model } from 'Types/entity';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';
import { IMultilinePathOptions } from './MultilinePath';
import PrepareDataUtil, { IVisibleItem } from './PrepareDataUtil';
import { IBreadCrumbsOptions } from './interface/IBreadCrumbs';
import { TFontSize } from 'Controls/interface';

// TODO удалить, когда появится возможность находить значение ширины иконок и отступов.
export const ARROW_WIDTH = 16;
export const PADDING_RIGHT = 2;

export default {
    canShrink(
        minWidth: number,
        itemWidth: number,
        currentWidth: number,
        availableWidth: number
    ): boolean {
        return currentWidth + minWidth - itemWidth < availableWidth;
    },
    getTextWidth(text: string, size: string = 'xs'): number {
        return getFontWidth(text, size);
    },
    getItemsWidth(
        items: Record[],
        options: IMultilinePathOptions,
        getTextWidth: Function = this.getTextWidth
    ): number[] {
        const itemsWidth = [];
        // В HeadingPath если для кнопки назад установлен размер больше 3XL, то для items проставляется размер m.
        const currentFontSizeItems =
            options.backButtonFontSize &&
            this.updateBreadcrumbsSize(options.backButtonFontSize, options.fontSize);
        items.forEach((item, index) => {
            const itemTitleWidth = getTextWidth(
                item.get(options.displayProperty),
                currentFontSizeItems || options.fontSize
            );
            const itemWidth = index !== 0 ? itemTitleWidth + ARROW_WIDTH : itemTitleWidth;
            itemsWidth.push(itemWidth + PADDING_RIGHT);
        });
        return itemsWidth;
    },
    calculateItemsWithShrinkingLast(
        items: Record[],
        options: IMultilinePathOptions,
        width: number,
        getTextWidth: Function = this.getTextWidth
    ): { visibleItems: Record[]; indexEdge: number } {
        const itemsWidth = this.getItemsWidth(items, options, getTextWidth);
        let indexEdge = 0;
        let visibleItems;
        let firstContainerItems = [];
        if (items.length <= 2) {
            // Если крошек меньше двух, располагаем их в первом контейнере
            firstContainerItems = items.map((item, index, arr) => {
                const withOverflow = arr[index].get(options.displayProperty).length > 3;
                return PrepareDataUtil.getItemData(index, arr, false, withOverflow);
            });
            return {
                visibleItems: firstContainerItems,
                indexEdge: items.length,
            };
        } else {
            // Если крошки занимают меньше доступной ширины, начинам расчеты
            let firstContainerWidth = 0;
            // заполняем в первый контейнер то, что помещается. Запоминаем индекс последней крошки
            while (firstContainerWidth < width && indexEdge < items.length) {
                firstContainerWidth += itemsWidth[indexEdge];
                indexEdge++;
            }
            indexEdge -= 1;
            for (let i = 0; i < indexEdge; i++) {
                firstContainerItems.push(items[i]);
            }
            // позволяем сокращаться последней папке в первом контейнере
            const minWidthOfLastItem = this.getMinWidth(items, options, indexEdge, getTextWidth);
            if (firstContainerWidth - itemsWidth[indexEdge] + minWidthOfLastItem <= width) {
                firstContainerItems.push(items[indexEdge]);
                indexEdge++;
            }
            visibleItems = PrepareDataUtil.drawBreadCrumbsItems(firstContainerItems);
            visibleItems[visibleItems.length - 1].withOverflow = true;
            return {
                visibleItems,
                indexEdge,
            };
        }
    },
    getMinWidth(
        items: Record[],
        options: IBreadCrumbsOptions,
        index: number,
        getTextWidth: Function
    ): number {
        const text = items[index].get(options.displayProperty);
        if (text) {
            let textWidth =
                getTextWidth(text.substring(0, 3) + '...', options.fontSize) + PADDING_RIGHT;
            textWidth = index === 0 ? textWidth : textWidth + ARROW_WIDTH;
            return textWidth;
        }
        return 0;
    },
    calculateItemsWithDots(
        items: Record[],
        options: IBreadCrumbsOptions,
        indexEdge: number,
        width: number,
        dotsWidth: number,
        getTextWidth: Function = this.getTextWidth
    ): IVisibleItem[] {
        const crumbsItems = items || [];
        let secondContainerWidth = 0;
        let shrinkItemIndex;
        const itemsWidth = this.getItemsWidth(crumbsItems, options, getTextWidth);
        for (let i = indexEdge; i < crumbsItems.length; i++) {
            secondContainerWidth += itemsWidth[i];
        }
        // Сначала пробуем замылить предпоследнюю крошку
        secondContainerWidth -= itemsWidth[crumbsItems.length - 2];
        const minWidthOfPenultimateItem =
            crumbsItems.length > 2
                ? this.getMinWidth(crumbsItems, options, crumbsItems.length - 2, getTextWidth)
                : undefined;
        secondContainerWidth += minWidthOfPenultimateItem;
        // если второй контейнер по ширине больше, чем доступная ширина, начинаем расчеты
        if (secondContainerWidth > width && crumbsItems.length > 2) {
            // предпоследняя не уместилась - сразу вычитаем ее мин.ширину
            secondContainerWidth -= minWidthOfPenultimateItem;
            const secondContainerItems = [];
            // если замылить не получилось - показываем точки
            secondContainerWidth += dotsWidth;
            let index;
            let currentMinWidth;
            // предпоследняя не поместилась - начинаем с пред-предпоследней и так далее
            for (index = crumbsItems.length - 3; index >= indexEdge; index--) {
                currentMinWidth = this.getMinWidth(crumbsItems, options, index, getTextWidth);
                if (secondContainerWidth <= width) {
                    break;
                } else if (
                    this.canShrink(currentMinWidth, itemsWidth[index], secondContainerWidth, width)
                ) {
                    shrinkItemIndex = index;
                    secondContainerWidth -= itemsWidth[index] - currentMinWidth;
                    break;
                } else {
                    secondContainerWidth -= itemsWidth[index];
                }
            }
            index = index === -1 && indexEdge === 0 ? 0 : index;
            // заполняем крошками, которые влезли, второй контейнер (не считая последней)
            for (let j = indexEdge; j <= index; j++) {
                const itemTitle = crumbsItems[j].get(options.displayProperty) || '';
                secondContainerItems.push(
                    PrepareDataUtil.getItemData(
                        j,
                        crumbsItems,
                        true,
                        j === index && itemTitle.length > 3
                    )
                );
            }
            // добавляем точки
            const dotsItem = new Model({
                rawData: {
                    [options.displayProperty]: '...',
                    [options.keyProperty]: 'dots',
                },
                keyProperty: options.keyProperty,
            });

            secondContainerItems.push({
                item: dotsItem,
                isDots: true,
                hasArrow: true,
            });
            // добавляем последнюю папку
            secondContainerItems.push(
                PrepareDataUtil.getItemData(crumbsItems.length - 1, crumbsItems, true, false)
            );

            return secondContainerItems;
        } else {
            // если все остальные крошки поместились - пушим по второй контейнер
            const secondContainerItems = [];
            const preLastItemTitle =
                crumbsItems?.[crumbsItems.length - 2]?.get(options.displayProperty) || '';
            for (let j = indexEdge; j < crumbsItems.length; j++) {
                const withOverflow = j === crumbsItems.length - 2 && preLastItemTitle.length > 3;
                secondContainerItems.push(
                    PrepareDataUtil.getItemData(j, crumbsItems, true, withOverflow)
                );
            }
            if (secondContainerItems.length <= 2) {
                secondContainerItems.forEach((item) => {
                    const itemTitle = item.item.get(options.displayProperty) || '';
                    if (!item.isDots && itemTitle.length > 3) {
                        item.withOverflow = true;
                    }
                });
            }
            return secondContainerItems;
        }
    },
    updateBreadcrumbsSize(backButtonSize: TFontSize, defaultSize: TFontSize): TFontSize {
        let result = defaultSize;
        // Для кнопки "Назад" размером больше '3xl' крошки должны быть размера 'm'
        if (['3xl', '4xl', '5xl', '6xl', '7xl'].indexOf(backButtonSize) >= 0) {
            result = 'm';
        }
        return result;
    },
};
