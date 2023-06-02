/**
 * @kaizen_zone c168c4c4-c8bc-47f2-973f-289c353400c0
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/InfoBox/Template/InfoBox';
import { IInfoBoxOptions, IStickyPopupPosition } from 'Controls/popup';
import {
    IBorderRadiusOptions,
    IValidationStatusOptions,
    TValidationStatus,
} from 'Controls/interface';
import { Logger } from 'UI/Utils';
import 'css!Controls/popupTemplate';
import { IResizeOptions } from '../../interface/IResize';
import { controller } from 'I18n/i18n';
import {
    DEFAULT_MIN_OFFSET_HEIGHT,
    DEFAULT_MIN_OFFSET_WIDTH,
} from 'Controls/_popupTemplate/Util/PopupConstants';

type TArrowPosition = 'start' | 'end' | 'center';
type TStyle =
    | 'danger'
    | 'secondary'
    | 'warning'
    | 'success'
    | 'info'
    | 'primary'
    | 'unaccented'
    | TValidationStatus;

export interface IInfoboxTemplateOptions
    extends IControlOptions,
        IInfoBoxOptions,
        IValidationStatusOptions,
        IBorderRadiusOptions,
        IResizeOptions {
    stickyPosition?: IStickyPopupPosition;
    backgroundStyle?: string;
}

export type TVertical = 'top' | 'bottom' | 'center';
export type THorizontal = 'left' | 'right' | 'center';

/**
 * Базовый шаблон {@link /doc/platform/developmentapl/interface-development/controls/openers/infobox/ всплывающей подсказки}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/infobox/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @class Controls/_popupTemplate/InfoBox
 * @extends UI/Base:Control
 *
 * @public
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/interface:IBorderRadius
 * @demo Controls-demo/PopupTemplate/Infobox/Index
 */
export default class InfoboxTemplate extends Control<IInfoboxTemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _arrowSide: THorizontal | TVertical;
    protected _arrowPosition: TArrowPosition;
    protected _borderStyle: TStyle;
    protected _horizontalDirection: string;
    protected _maxWidthOffset: number;
    protected _minWidthOffset: number;
    protected _maxHeightOffset: number;
    protected _minHeightOffset: number;

    protected _beforeMount(newOptions: IInfoboxTemplateOptions): void {
        this._updateOffset(newOptions);
        this._setPositionSide(newOptions.stickyPosition);
        this._borderStyle = InfoboxTemplate._setBorderStyle(
            (newOptions.style || newOptions.borderStyle) as TStyle,
            newOptions.validationStatus
        );

        if (newOptions.style !== undefined) {
            Logger.warn(
                `${this._moduleName}: Используется устаревшая опция style,` +
                    ' нужно использовать borderStyle',
                this
            );
        }
    }

    protected _beforeUpdate(newOptions: IInfoboxTemplateOptions): void {
        this._updateOffset(newOptions);
        this._setPositionSide(newOptions.stickyPosition);
        this._borderStyle = InfoboxTemplate._setBorderStyle(
            (newOptions.style || newOptions.borderStyle) as TStyle,
            newOptions.validationStatus
        );
    }

    _setPositionSide(stickyPosition: IStickyPopupPosition): void {
        const { direction } = stickyPosition;
        if (
            direction.horizontal === 'left' &&
            stickyPosition.targetPoint.horizontal === 'left'
        ) {
            this._arrowSide = 'right';
            this._arrowPosition = InfoboxTemplate._getArrowPosition(
                direction.vertical as TVertical
            );
        } else if (
            direction.horizontal === 'right' &&
            stickyPosition.targetPoint.horizontal === 'right'
        ) {
            this._arrowSide = 'left';
            this._arrowPosition = InfoboxTemplate._getArrowPosition(
                direction.vertical as TVertical
            );
        } else if (
            direction.vertical === 'top' &&
            stickyPosition.targetPoint.vertical === 'top'
        ) {
            this._arrowSide = 'bottom';
            this._arrowPosition = InfoboxTemplate._getArrowPosition(
                direction.horizontal as THorizontal
            );
        } else if (
            direction.vertical === 'bottom' &&
            stickyPosition.targetPoint.vertical === 'bottom'
        ) {
            this._arrowSide = 'top';
            this._arrowPosition = InfoboxTemplate._getArrowPosition(
                direction.horizontal as THorizontal
            );
        }
        else {
            this._arrowSide = direction.vertical === 'bottom' ? 'top' : 'bottom';
            this._arrowPosition = InfoboxTemplate._getArrowPosition(
                direction.horizontal as THorizontal
            );
        }
        this._horizontalDirection = direction.horizontal || 'right';
    }

    protected _close(): void {
        this._notify('close', [], { bubbling: true });
    }

    protected _getBackgroundStyle(): string {
        const backgroundStyle = this._options.backgroundStyle;
        // Добавляем проверку на значение по умолчанию, что бы навесить класс с переменной для возможности темизации.
        if (backgroundStyle === 'secondary') {
            return 'controls-InfoBoxTemplate__backgroundStyle-secondary';
        }
        return `controls-background-${backgroundStyle}`;
    }

    protected _onResizingOffset(
        event: Event,
        offset: object,
        position: string
    ): void {
        this._notify('popupMovingSize', [offset, position], { bubbling: true });
    }

    private _updateOffset(options: IInfoboxTemplateOptions): void {
        if (options.stickyPosition) {
            this._maxWidthOffset = Math.max(
                (options.stickyPosition.position?.maxWidth ||
                    DEFAULT_MIN_OFFSET_WIDTH) -
                    (options.stickyPosition.position?.width || options.stickyPosition.sizes?.width ||
                        DEFAULT_MIN_OFFSET_WIDTH),
                0
            );
            this._minWidthOffset = Math.max(
                (options.stickyPosition.position?.width || options.stickyPosition.sizes?.width ||
                    DEFAULT_MIN_OFFSET_WIDTH) -
                    (options.stickyPosition.position?.minWidth ||
                        DEFAULT_MIN_OFFSET_WIDTH),
                0
            );
            this._maxHeightOffset = Math.max(
                (options.stickyPosition.position?.maxHeight ||
                    DEFAULT_MIN_OFFSET_HEIGHT) -
                    (options.stickyPosition.position?.height || options.stickyPosition.sizes?.height ||
                        DEFAULT_MIN_OFFSET_HEIGHT),
                0
            );
            this._minHeightOffset = Math.max(
                (options.stickyPosition.position?.height || options.stickyPosition.sizes?.height ||
                    DEFAULT_MIN_OFFSET_HEIGHT) -
                    (options.stickyPosition.position?.minHeight ||
                        DEFAULT_MIN_OFFSET_HEIGHT),
                0
            );
        }
    }

    static defaultProps: Partial<IInfoboxTemplateOptions> = {
        closeButtonVisible: true,
        validationStatus: 'valid',
        borderStyle: 'secondary',
        backgroundStyle: 'secondary',
        borderRadius: 'xs',
        resizable: false,
        resizingOptions: {
            step: 1,
            position: 'right-bottom',
        },
    };

    private static _getArrowPosition(
        side: TVertical | THorizontal
    ): TArrowPosition {
        if (side === 'left' || side === 'top') {
            if (controller.currentLocaleConfig.directionality === 'rtl') {
                return 'start';
            }
            return 'end';
        }
        if (side === 'right' || side === 'bottom') {
            if (controller.currentLocaleConfig.directionality === 'rtl') {
                return 'end';
            }
            return 'start';
        }
        return 'center';
    }

    private static _setBorderStyle(
        style: TStyle,
        validationStatus: TValidationStatus
    ): TStyle {
        if (validationStatus !== 'valid') {
            return validationStatus;
        } else {
            return style;
        }
    }
}
/**
 * @typedef {Object} TargetPoint
 * @description Точка позиционирования всплывающей подсказки относительно вызывающего элемента.
 * @property {String} vertical Выравнивание по вертикали.
 * Доступные значения: top, bottom.
 * @property {String} horizontal Выравнивание по горизонтали.
 * Доступные значения: right, left.
 */
/**
 * @typedef {Object} Direction
 * @description Выравнивание всплывающей подсказки относительно точки позиционирования.
 * @property {String} vertical Выравнивание по вертикали.
 * Доступные значения: top, bottom.
 * @property {String} horizontal Выравнивание по горизонтали.
 * Доступные значения: right, left.
 */
/**
 * @typedef {Object} Controls/popupTemplate/TStickyPosition
 * @description Позиционирование всплывающей подсказки.
 * @property {TargetPoint} targetPoint Точка позиционирования относительно вызывающего элемента.
 * @property {Direction} direction Выравнивание относительно точки позиционирования.
 */
/**
 * @name Controls/_popupTemplate/InfoBox#closeButtonVisible
 * @cfg {Boolean} Устанавливает видимость кнопки закрытия всплывающей подсказки.
 * @default true
 */
/**
 * @name Controls/_popupTemplate/InfoBox#borderStyle
 * @cfg {String} Устанавливает стиль отображения всплывающей подсказки.
 * @default secondary
 * @variant warning
 * @variant info
 * @variant unaccented
 * @variant secondary
 * @variant success
 * @variant danger
 */
/**
 * @name Controls/_popupTemplate/InfoBox#borderRadius
 * @cfg {BorderRadius} Устанавливает закругление обводки контрола.
 * @default xs
 */
/**
 * @name Controls/_popupTemplate/InfoBox#stickyPosition
 * @cfg {Controls/popupTemplate/TStickyPosition.typedef} Содержит сведения о позиционировании всплывающей подсказки.
 * @remark
 * При открытии всплывающей подсказки с помощью {@link Controls/popup:Sticky}, в шаблон передаётся значение для опции stickyPosition.
 * Его рекомендуется использовать для конфигурации Controls/popupTemplate:InfoBox, что и показано в следующем примере.
 * <pre>
 * <Controls.popupTemplate:InfoBox stickyPosition="{{_options.stickyPosition}}" />
 * </pre>
 * Значение опции задавать вручную не нужно.
 */

/**
 * @name Controls/_popupTemplate/InfoBox#content
 * @cfg {function|String} Шаблон, который будет отображать всплывающая подсказка.
 */

/**
 * @name Controls/_popupTemplate/InfoBox#backgroundStyle
 * @cfg {String} Устанавливает фон отображения всплывающей подсказки.
 * @default secondary
 * @variant default
 * @variant secondary
 * @demo Controls-demo/PopupTemplate/Infobox/BackgroundStyle/Index
 */
