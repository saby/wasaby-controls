import * as React from 'react';
import { Model } from 'Types/entity';
import { ContentTemplate } from './ChipsButton';

export interface IContentTemplateOptions {
    selected?: boolean;
    captionTemplate: React.ReactElement;
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
    contentTemplate?: React.FC<IContentTemplateOptions>;
    /**
     * Шаблон для иконки
     */
    iconTemplate?: React.ReactElement<IContentTemplateOptions>;
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

function CaptionTemplate(props: IItemTemplateProps) {
    return (
        <span
            className={
                `controls-ButtonGroup__button-caption controls-fontsize-${props.fontSize}` +
                ` ${props.className || ''}`
            }
        >
            {props.caption ||
                props.item.get(props.displayProperty || 'title') ||
                props.item.get('caption')}
        </span>
    );
}

/**
 * Базовый шаблон для компонента "Чипсы"
 * @param props
 */
export default function itemTemplate(props: IItemTemplateProps) {
    const { item, selected, fontSize } = props;
    const icon = item?.get?.('icon');
    const iconSize = item?.get?.('iconSize') || 's';
    const iconOptions = item?.get?.('iconOptions') || {};
    const IconTemplate = item?.get?.('iconTemplate');
    return (
        <ContentTemplate
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
}
