/**
 * @kaizen_zone 4caa6c7f-c139-49cb-876d-d68aca67db9f
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { IRgbColor } from 'Controls/_themesExt/interface/IColor';
import { toRgb } from 'Controls/Utils/colorUtil';
import { Wrapper, IContentOptions } from 'Controls/themes';
import 'css!Controls/themesExt';

type TBrightness = 'dark' | 'light';

export interface IZenWrapperOptions extends IControlProps {
    dominantColor: string;
    complementaryColor: string;
    brightness: TBrightness;
    content?: React.ReactElement<IContentOptions>;
    children?: React.ReactElement<IContentOptions>;
    contentOptions?: unknown;
    onClick?: Function;
    onContextMenu?: Function;
    onLongtap?: Function;
    onMouseDown?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onMouseMove?: Function;
    onMouseUp?: Function;
    onSwipe?: Function;
    onTouchMove?: Function;
    onKeyDown?: Function;
    onWheel?: Function;
}

const getMonochromeColorRGB = (brightness: TBrightness): string => {
    return brightness === 'dark' ? '255,255,255' : '0,0,0';
};

const getColor = (rgb: IRgbColor): string => {
    const { r: red, g: green, b: blue } = rgb;
    return `rgb(${red},${green},${blue})`;
};

const getDerivedStateFromProps = (options: IZenWrapperOptions): Record<string, string> => {
    return calculateVariables(
        calculateRGB(options.dominantColor),
        calculateRGB(options.complementaryColor),
        options.brightness
    );
};

export const calculateRGB = (color: string): IRgbColor => {
    let preparedColor = color;
    if (/^(\d+),\s*(\d+),\s*(\d+)$/.test(color)) {
        preparedColor = 'rgb(' + color + ')';
    }
    const calculatedRGB = toRgb(preparedColor);
    return calculatedRGB
        ? {
              r: calculatedRGB.r,
              g: calculatedRGB.g,
              b: calculatedRGB.b,
          }
        : { r: 255, g: 255, b: 255 };
};

export const calculateVariables = (
    dominantRGB: IRgbColor,
    complementaryRGB: IRgbColor,
    brightness: TBrightness
): Record<string, string> => {
    const variables = {
        '--dominant-color_zen': getColor(dominantRGB),
        '--dominant_zen_rgb': `${dominantRGB.r},${dominantRGB.g},${dominantRGB.b}`,
        '--mono_zen_rgb': getMonochromeColorRGB(brightness),
    };
    if (complementaryRGB) {
        variables['--complementary-color_zen'] = getColor(complementaryRGB);
        variables[
            '--complementary_zen_rgb'
        ] = `${complementaryRGB.r},${complementaryRGB.g},${complementaryRGB.b}`;
    }
    return variables;
};

/**
 * Контейнер для стилизации элементов, лежащих на фоне некоторого изображения. Цвета элементов рассчитываются исходя из доминантного цвета изображения и комплементарного к нему.
 * @class Controls/_themesExt/ZenWrapper
 * @implements Controls/interface:IControl
 * @public
 * @demo Controls-demo/themes/ZenWrapper/Index
 * @remark Доминантный и комплементарный цвет изображения должны быть заранее вычислены и переданы в опции контрола.
 */

function ZenWrapper(props: IZenWrapperOptions, ref): React.ReactElement {
    const variables = getDerivedStateFromProps(props);
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};

    const className =
        `controls_theme-${props.theme} controls-ZenWrapper` +
        ` controls-ZenWrapper_complementary${!props.complementaryColor ? '-empty' : ''}` +
        ` controls-ZenWrapper__${props.brightness} ${attrs.className}`;

    const events = {
        onClick: props.onClick,
        onContextMenu: props.onContextMenu,
        onLongtap: props.onLongtap,
        onMouseDown: props.onMouseDown,
        onMouseEnter: props.onMouseEnter,
        onMouseLeave: props.onMouseLeave,
        onMouseMove: props.onMouseMove,
        onMouseUp: props.onMouseUp,
        onSwipe: props.onSwipe,
        onTouchMove: props.onTouchMove,
        onKeyDown: props.onKeyDown,
        onWheel: props.onWheel,
    };

    return (
        <Wrapper
            ref={ref}
            {...events}
            attrs={attrs}
            className={className}
            contentOptions={props.contentOptions}
            content={props.content}
            children={props.children}
            context={props.context}
            variables={variables}
            style={props.style}
            readOnly={props.readOnly}
        />
    );
}

export default React.forwardRef(ZenWrapper);

/**
 * @name Controls/_themesExt/ZenWrapper#dominantColor
 * @cfg {String} Задает доминантный цвет изображения на фоне которого строится контрол. Цвет в формате rgb - 45, 34, 81
 * @example
 * Установлен доминантный цвет
 * <pre>
 *    <Controls.themesExt:ZenWrapper dominantColor="255, 255, 255 >
 *       <ws:partial template="MyModule/someContent" />
 *    </Controls.themesExt:ZenWrapper>
 * </pre>
 * @see option complementaryColor
 */

/**
 * @name Controls/_themesExt/ZenWrapper#complementaryColor
 * @cfg {String} Задает комплементарный цвет к доминантному цвет изображения на фоне которого строится контрол. Цвет в формате rgb - 45, 34, 81
 * @example
 * Установлен комплементарный цвет
 * <pre>
 *    <Controls.themesExt:ZenWrapper complementaryColor="178, 35, 35" >
 *       <ws:partial template="MyModule/someContent" />
 *    </Controls.themesExt:ZenWrapper>
 * </pre>
 * @see option dominantColor
 */

/**
 * @name Controls/_themesExt/ZenWrapper#brightness
 * @cfg {String} Определяет темным или светлым является доминантный цвет изображения.
 * @variant dark Изображение с доминантным темным цветом.
 * @variant light Изображение с доминантным светлым цветом.
 * @default light
 * @example
 * Кнопка в режиме отображения "linkButton".
 * Установлен комплементарный цвет и яркость "светлый"
 * <pre>
 *    <Controls.themesExt:ZenWrapper complementaryColor="178, 35, 35" brightness="light" >
 *       <ws:partial template="MyModule/someContent" />
 *    </Controls.themesExt:ZenWrapper>
 * </pre>
 * @see option complementaryColor
 * @see option dominantColor
 */
