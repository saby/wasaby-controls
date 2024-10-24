/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import {
    IControlProps,
    IExpandable,
    IExpandableOptions,
    IFontColorStyle,
    IFontColorStyleOptions,
    IFontSize,
    IFontSizeOptions,
    IFontWeight,
    IFontWeightOptions,
    ITooltip,
    ITooltipOptions,
    TFontWeight
} from 'Controls/interface';
import { useTheme } from 'UI/Contexts';
import { Logger } from 'UI/Utils';
import Util from './Util';
import { getTextWidth } from 'Controls/sizeUtils';
import 'css!Controls/spoiler';

type TCaptions = string | string[];
type TView = 'expanded' | 'collapsed';

export interface IHeadingOptions
    extends IExpandableOptions,
        IFontSizeOptions,
        ITooltipOptions,
        IFontWeightOptions,
        IFontColorStyleOptions,
        IControlProps {
    /**
     * @cfg {string | string[]} Заголовок.
     * @name Controls/_spoiler/IHeading#captions
     * @remark
     * Изменяемый заголовок в зависимости от {@link Controls/_spoiler/Heading#expanded состояния развернутости}
     * настраивается через массив с парой заголовков.
     * Первый элемент соответствует expanded = true.
     * Второй элемент соответствует expanded = false.
     * Для изменения пары заголовков нужно передать новый массив.
     *
     * Полезные ссылки:
     * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_spoiler.less переменные тем оформления}
     *
     * @demo Controls-demo/Spoiler/Heading/Captions/Index
     */
    captions: TCaptions;
    /**
     * @name Controls/_spoiler/IHeading#captionPosition
     * @cfg {String} Позиция заголовка относительно контейнера.
     * @variant left
     * @variant edgeLeft
     * @variant right
     * @default right
     * @demo Controls-demo/Spoiler/Heading/CaptionPosition/Index
     */
    captionPosition?: 'left' | 'right' | 'edgeLeft';

    onExpandedChanged?: (event: React.MouseEvent, value: IExpandableOptions['expanded']) => void;
}

/**
 * Интерфейс опций контрола {@link Controls/spoiler:Heading}.
 * @public
 */
export interface IHeading extends IExpandable, IFontSize, ITooltip, IFontWeight, IFontColorStyle {
    readonly '[Controls/_spoiler/IHeading]': boolean;
}

function _captionToString(caption?: string): string {
    if (typeof caption === 'string') {
        return caption;
    }

    return '';
}

function _calcCaption(captions: TCaptions, expanded: boolean): string {
    if (captions instanceof Array) {
        const requiredCountCaptions: number = 2;

        if (captions.length !== requiredCountCaptions) {
            Logger.error('Неверное количество заголовков.');
        }
        const caption: string | undefined = expanded ? captions[0] : captions[1];
        return _captionToString(caption);
    } else {
        return captions;
    }
}

function _calcView(expanded: boolean): TView {
    return expanded ? 'expanded' : 'collapsed';
}

function _calcFontWeight(expanded: boolean, fontWeight?: TFontWeight): TFontWeight {
    if (fontWeight) {
        return fontWeight;
    }

    return expanded ? 'bold' : 'default';
}

function _calcFontColorStyle(expanded: boolean, fontColorStyle?: string): string {
    if (fontColorStyle) {
        return fontColorStyle;
    }

    return expanded ? 'secondary' : 'label';
}

function CollapseLight(className: string) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M13.6,10.38l-.84.85L8,6.48,3.21,11.23l-.81-.81L8,4.77Z" />
        </svg>
    );
}

function ExpandLight(className: string) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M8,11.23,2.4,5.58l.81-.81L8,9.52l4.79-4.75.81.85Z" />
        </svg>
    );
}

/**
 * Графический контрол, отображаемый в виде загловка с состоянием развернутости.
 * Предоставляет пользователю возможность запуска события смены состояния развернутости при нажатии на него.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_spoiler.less переменные тем оформления}
 * * {@link http://axure.tensor.ru/StandardsV8/%D1%81%D0%BF%D0%BE%D0%B9%D0%BB%D0%B5%D1%80%D1%8B_%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%B0_%D1%81%D0%BF%D0%BE%D0%B9%D0%BB%D0%B5%D1%80%D0%BE%D0%B2.html стандарт}
 *
 * @class Controls/_spoiler/Heading
 * @extends Controls/interface:IControl
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IExpandable
 *
 * @public
 * @demo Controls-demo/Spoiler/Heading/Index
 */
export default React.forwardRef(function Heading(props: IHeadingOptions, ref) {
    const {captions = '', fontSize = 'm', captionPosition = 'right'} = props;
    const [expanded, setExpanded] = React.useState<boolean>(Util._getExpanded(props, false));
    const [tooltip, setTooltip] = React.useState<string>(props.tooltip);
    const captionContainer = React.useRef<HTMLDivElement>();

    let exp = expanded;
    if (props.hasOwnProperty('expanded') && expanded !== props.expanded) {
        exp = props.expanded as boolean;
    }

    const caption = React.useMemo(() => {
        return _calcCaption(captions, exp);
    }, [exp, captions]);
    const fontWeight = React.useMemo(() => {
        return _calcFontWeight(exp, props.fontWeight);
    }, [exp, props.fontWeight]);

    const fontColorStyle = React.useMemo(() => {
        return _calcFontColorStyle(exp, props.fontColorStyle);
    }, [exp, props.fontColorStyle]);
    const view = React.useMemo(() => {
        return _calcView(exp);
    }, [exp]);

    const theme = useTheme(props);
    React.useEffect(() => {
        setExpanded(exp);
    }, [exp]);
    const clickHandler = (event: React.MouseEvent) => {
        const exp = !expanded;
        if (!props.hasOwnProperty('expanded')) {
            setExpanded(exp);
        }
        setTooltip('');
        props.onExpandedChanged?.(event, exp);
    };
    const mouseenterHandler = () => {
        if (props.tooltip) {
            setTooltip(props.tooltip);
        } else {
            const captionWidth = getTextWidth(caption);
            if (captionWidth > captionContainer.current.clientWidth) {
                setTooltip(caption);
            }
        }
    };
    const attrs = wasabyAttrsToReactDom(props.attrs) || {};

    const captionClassName =
        'controls-SpoilerHeading__caption ws-ellipsis' +
        ` controls-fontweight-${fontWeight}` +
        ` controls-SpoilerHeading__caption_${view}` +
        ` controls-SpoilerHeading__caption_fontColorStyle-${fontColorStyle}` +
        ` controls-text-${props.fontColorStyle}` +
        ` controls-SpoilerHeading__caption_captionPosition-${captionPosition}` +
        Util._getCaptionPaddingClass(captionPosition);

    const iconClassName =
        'controls-SpoilerHeading__icon' +
        ` controls-icon_style-${props.fontColorStyle}` +
        ` controls-SpoilerHeading__icon_fontColorStyle-${fontColorStyle}`;
    return (
        <div
            {...attrs}
            ref={ref}
            className={`controls_spoiler_theme-${theme} controls-SpoilerHeading controls-SpoilerHeading__${
                expanded ? 'expanded' : 'collapsed'
            }${props.captionPosition === 'edgeLeft' ? ' tw-w-full' : ''} ${props.className}`}
            onClick={clickHandler}
            onMouseEnter={mouseenterHandler}
            title={tooltip}
        >
            <div className={`controls-SpoilerHeading__wrapper controls-fontsize-${fontSize}`}>
                <div className="controls-SpoilerHeading__icon-baseline">&#65279;</div>
                <div
                    className={`controls-SpoilerHeading__iconWrapper${
                        props.captionPosition === 'edgeLeft'
                            ? ' controls-SpoilerHeading__iconWrapper_align_edge-right'
                            : ''
                    }`}
                >
                    {expanded ? CollapseLight(iconClassName) : ExpandLight(iconClassName)}
                </div>
                <div ref={captionContainer} className={captionClassName}>
                    {caption}
                </div>
            </div>
        </div>
    );
});

/**
 * @name Controls/_spoiler/Heading#fontWeight
 * @cfg {String} Насыщенность шрифта.
 * @variant bold
 * @variant default
 *
 * @remark
 * Когда опция не задана, то её значение определяется контролом в зависимости от состояния развернутости.
 * В развернутом состоянии это "bold", а в свёрнутом — "default".
 *
 * @demo Controls-demo/Spoiler/Heading/FontWeight/Index
 * @see expanded
 */
/**
 * @name Controls/_spoiler/Heading#fontColorStyle
 * @cfg {Controls/interface/TFontColorStyle.typedef} Стиль цвета текста и иконки контрола.
 *
 * @remark
 * Когда опция не задана, то её значение определяется контролом в зависимости от состояния развернутости.
 * В развернутом состоянии это "secondary", а в свёрнутом — "label".
 *
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.spoiler:Heading captions="{{_captions}}" fontColorStyle="secondary"/>
 * </pre>
 *
 * @demo Controls-demo/Spoiler/Heading/FontColorStyle/Index
 * @see expanded
 */
