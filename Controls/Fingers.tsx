/**
 * @kaizen_zone 0905a500-8f7f-40a7-b7ab-79828ca54b5f
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/executor';
import { RecordSet } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';
import { isEqual } from 'Types/object';
import { IRoundBorder, IItemsOptions, ISingleSelectableOptions } from 'Controls/interface';

import 'css!Controls/Fingers';

/**
 * Варианты значений режима отрисовки изображения.
 * @typedef Controls/Fingers/TImageViewMode
 * @variant none Без изображения
 * @variant rectangle Прямоугольное изображение
 * @variant circle Круглое изображение
 */
export type TImageViewMode = 'none' | 'rectangle' | 'circle';

/**
 * Варианты значений для размещения на странице списка в виде "пальцев".
 * @typedef Controls/Fingers/TTocAlignment
 * @variant left расположение слева. Скруглены углы с правой стороны.
 * @variant right расположение справа. Скруглены углы с левой стороны.
 */
export type TFingerAlignment = 'left' | 'right';

/**
 * Варианты стилей записи списка в виде "пальцев" в выбранном состоянии.
 * @typedef Controls/Fingers/TSelectedStyle
 * @variant default (чёрный)
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 */
export type TSelectedStyle =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';

interface ICommonProps {
    selectedStyle: TSelectedStyle;
    displayProperty: string;
    imageProperty: string;
}

interface IFingerProps {
    key: CrudEntityKey;
    index: number;
    item: Model;
}

export interface IProps
    extends TInternalProps,
        ISingleSelectableOptions,
        IItemsOptions<object>,
        ICommonProps {
    alignment: TFingerAlignment;
    imageViewMode?: TImageViewMode;
    fallbackImage?: string;
    keyProperty: string;
    items: RecordSet;
    onSelectedKeyChanged: (key: CrudEntityKey) => void;
}

export interface IState {
    _selectedKey: CrudEntityKey;
    _roundBorder: IRoundBorder;
    _hasItemImages: boolean;
}

/**
 * Контрол списка в виде "пальцев".
 * @class Controls/Fingers
 * @public
 */
export default class Fingers extends React.Component<IProps> {
    readonly state: IState;

    constructor(props: IProps) {
        super(props);
        this.state = {
            _selectedKey: props.selectedKey,
            _roundBorder: Fingers._resolveRoundBorder(props.alignment),
            _hasItemImages: Fingers._resolveHasItemImages(
                props.items,
                props.imageProperty,
                props.imageViewMode
            ),
        };
        this._itemTemplate = this._itemTemplate.bind(this);
    }

    shouldComponentUpdate(props: IProps, state?: IState): boolean {
        let changed = false;
        if (this.props.items !== props.items) {
            changed = true;
        }
        if (this.props.alignment !== props.alignment) {
            this.setState({
                _roundBorder: Fingers._resolveRoundBorder(props.alignment),
            });
            changed = true;
        }
        if (
            this.props.imageProperty !== props.imageProperty ||
            this.props.imageViewMode !== props.imageViewMode
        ) {
            const hasImage = Fingers._resolveHasItemImages(
                props.items,
                props.imageProperty,
                props.imageViewMode
            );
            this.setState({
                _hasItemImages: hasImage,
            });
            changed = true;
        }
        if (this.props.selectedKey !== props.selectedKey) {
            this.setState({
                _selectedKey: props.selectedKey,
            });
            changed = true;
        }
        if (!isEqual(state, this.state)) {
            changed = true;
        }
        return changed;
    }

    private _changeSelectedKey(selectedKey: CrudEntityKey): void {
        this.setState({
            _selectedKey: selectedKey,
        });
        this.props.onSelectedKeyChanged?.(selectedKey);
    }

    private _calcWrapperClassName(props: IFingerProps, isSelected: boolean): string {
        let wrapperClassName = 'Controls-Fingers__item Controls-Fingers__item-shadow';
        if (isSelected) {
            wrapperClassName += ` Controls-Fingers__item_marked_${this.props.selectedStyle}`;
        } else {
            wrapperClassName += ' Controls-Fingers__item_unmarked';
        }
        wrapperClassName +=
            ' hover-background-unaccented-same' +
            ` controls-border_tl-radius-${this.state._roundBorder.tl}` +
            ` controls-border_tr-radius-${this.state._roundBorder.tr}` +
            ` controls-border_br-radius-${this.state._roundBorder.br}` +
            ` controls-border_bl-radius-${this.state._roundBorder.tl}`;
        if (props.index < this.props.items.getCount() - 1) {
            wrapperClassName += ' controls-margin_bottom-s';
        }
        return wrapperClassName;
    }

    private _itemTemplate(
        props: IFingerProps,
        ref: React.RefObject<HTMLDivElement>
    ): React.ReactElement {
        const isSelected = this.state._selectedKey === props.item.getKey();
        const align = this.props.alignment;
        const title = props.item.get(this.props.displayProperty);
        const imagePath = this.state._hasItemImages
            ? props.item.get(this.props.imageProperty)
            : null;

        const className =
            'Controls-Fingers__item__content' +
            ` Controls-Fingers__item__content-align_${align}` +
            ` controls-padding_left-${align === 'right' ? 'l' : 'm'}` +
            ` controls-padding_right-${align === 'left' ? 'l' : 'm'}`;

        let contentClassName = 'ws-ellipsis';
        let imageContent: React.ReactElement<HTMLDivElement> = null;
        if (imagePath) {
            contentClassName += ` Controls-Fingers__item__content__title-align_${align}`;
            const imageStyle = {
                backgroundImage: `url("${imagePath}"), url("${this.props.fallbackImage}")`,
            };
            const imageClassName =
                'Controls-Fingers__item__content__image' +
                ` Controls-Fingers__item__content__image-imageViewMode_${this.props.imageViewMode}` +
                ` Controls-Fingers__item__content__image-align_${align}`;
            imageContent = <div style={imageStyle} className={imageClassName} />;
        }

        return (
            <div
                className={this._calcWrapperClassName(props, isSelected)}
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    return this._changeSelectedKey(props.item.getKey());
                }}
            >
                <div className={className}>
                    <div className={contentClassName} title={title}>
                        {title}
                    </div>
                    {imageContent}
                </div>
            </div>
        );
    }

    render() {
        const items: React.ReactElement[] = [];
        const style: React.CSSProperties = this.props.attrs.style || this.props.styleProp || {};

        let className = 'Controls-Fingers';
        if (this.props.attrs.className || this.props.className) {
            className += ` ${this.props.attrs.className || this.props.className}`;
        }

        this.props.items.forEach((item: Model, index: number) => {
            items.push(<this._itemTemplate key={item.getKey()} index={index} item={item} />);
        });

        return (
            <div ref={this.props.forwardedRef} className={className} style={style}>
                {items}
            </div>
        );
    }

    static defaultProps: Partial<IProps> = {
        alignment: 'left',
        imageViewMode: 'none',
        selectedStyle: 'default',
    };

    private static _resolveHasItemImages(
        items: RecordSet,
        imageProperty?: string,
        imageViewMode?: TImageViewMode
    ): boolean {
        let hasImage: boolean = false;

        if (imageProperty && imageViewMode !== 'none') {
            items.forEach((item) => {
                hasImage = hasImage || !!item.get(imageProperty);
            });
        }
        return hasImage;
    }

    private static _resolveRoundBorder(alignment: TFingerAlignment): IRoundBorder {
        const rounded = '2xl';
        const angular = 'null';
        if (alignment === 'left') {
            return {
                bl: angular,
                br: rounded,
                tl: angular,
                tr: rounded,
            };
        }
        return {
            bl: rounded,
            br: angular,
            tl: rounded,
            tr: angular,
        };
    }
}

/**
 * @name Controls/Fingers#alignment
 * @cfg {Controls/Fingers/TFingerAlignment.typedef} Размещение на странице.
 * @demo Controls-demo/Fingers/Alignment/Index
 * @default left
 */

/**
 * @name Controls/Fingers#imageViewMode
 * @cfg {Controls/Fingers/TImageViewMode.typedef} Режим отрисовки изображения
 * @demo Controls-demo/Fingers/imageViewMode/Index
 * @default none
 */

/**
 * @name Controls/Fingers#imageProperty
 * @cfg {String} Название поля записи в котором лежит ссылка на изображение.
 * @demo Controls-demo/Fingers/Base/Index
 */

/**
 * @name Controls/Fingers#fallbackImage
 * @cfg {String} Путь к заглушке, которая будет использована при отсутствии изображения.
 */

/**
 * @name Controls/Fingers#selectedStyle
 * @cfg {Controls/Fingers/TSelectedStyle.typedef} Стиль отображения кнопок в выбранном состоянии.
 * @default default
 * @demo Controls-demo/Fingers/Base/Index
 */

/**
 * @name Controls/Fingers#keyProperty
 * @cfg {String} Имя поля записи, в котором хранится ключ элемента.
 */

/**
 * @name Controls/Fingers#displayProperty
 * @cfg {String} Имя поля записи, в котором хранится текст содержимого элемента.
 */
