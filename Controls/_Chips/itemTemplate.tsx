import { FC, forwardRef, ReactElement } from 'react';
import { Model } from 'Types/entity';
import { ContentTemplate } from './ChipsButton';
import { getTextFontSizeClass } from 'Controls/Utils/getFontClass';

export interface IContentTemplateOptions {
    selected?: boolean;
    captionTemplate: ReactElement;
    item: Model;
    className?: string;
}

/**
 * Интерфейс для шаблона
 * @pubic
 */
export interface IItemTemplateProps {
    /**
     * Элемент для отображения
     */
    item: Model;
    /**
     * Имя поля элемента, значение которого будет отображаться в названии кнопки
     */
    displayProperty: string;
    /**
     * Шаблон для своего содержимого
     */
    contentTemplate?: FC<IContentTemplateOptions>;
    /**
     * Шаблон для иконки
     */
    iconTemplate?: ReactElement<IContentTemplateOptions>;
    /**
     * Имя поля элемента, значение которого будет отображаться в качестве счетчика
     */
    counterProperty?: string;
    /**
     * Определяет стиль счетчика
     */
    counterStyle?: string;
    /**
     * Определяет стиль шрифта
     */
    fontColorStyle?: string;
    /**
     * Определяет активность элемента
     */
    selected?: boolean;
    /**
     * Определяет размер шрифта
     */
    fontSize: string;
    /**
     * Определяет заголовок для кнопки
     */
    caption?: string;
    /**
     * Определяет класс, который будет навешен на кнопку
     */
    className?: string;
}

const CaptionTemplate = forwardRef((props: IItemTemplateProps, ref) => {
    return (
        <span
            ref={ref}
            className={
                `controls-ButtonGroup__button-caption controls-fontsize-${
                    props.fontSize
                } ${getTextFontSizeClass(props.fontSize)}` + ` ${props.className || ''}`
            }
        >
            {props.caption ||
                props.item.get(props.displayProperty || 'title') ||
                props.item.get('caption')}
        </span>
    );
});

/**
 * Базовый шаблон для компонента "Чипсы"
 * @param props
 */
export default forwardRef(function itemTemplate(props: IItemTemplateProps, ref) {
    const { item, selected, fontSize } = props;
    const icon = item?.get?.('icon');
    const iconSize = item?.get?.('iconSize') || 's';
    const iconOptions = item?.get?.('iconOptions') || {};
    const IconTemplate = item?.get?.('iconTemplate');
    return (
        <ContentTemplate
            ref={ref}
            {...props}
            icon={icon}
            iconTemplate={IconTemplate}
            iconSize={iconSize}
            iconOptions={iconOptions}
            value={selected}
            fontSize={fontSize}
            captionTemplate={() => {
                return props.contentTemplate ? (
                    <props.contentTemplate
                        selected={props.selected}
                        item={props.item}
                        className={props.className}
                        captionTemplate={
                            <CaptionTemplate
                                item={props.item}
                                fontSize={props.fontSize}
                                displayProperty={props.displayProperty}
                                caption={props.caption}
                            />
                        }
                    />
                ) : (
                    <CaptionTemplate
                        item={props.item}
                        displayProperty={props.displayProperty}
                        fontSize={props.fontSize}
                        className={props.className}
                        caption={props.caption}
                    />
                );
            }}
        />
    );
});
