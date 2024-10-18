/**
 * @kaizen_zone 711a1e90-e32a-4501-9a88-99d88531ecd2
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { useReadonly } from 'UICore/Contexts';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { detection } from 'Env/Env';
import RatingViewModel from './Rating/RatingViewModel';
import 'css!Controls/progress';

type IconSize = 'default' | '2xs' | 'xs' | 's' | 'm' | 'l';
type TIconColorMode = 'static' | 'dynamic';
type TPrecision = 0 | 0.5;
type TIconFill = 'none' | 'full';

const DEFAULT_ICON_SIZE = 's';
const ICON_PADDINGS = {
    default: '2xs',
    '2xs': '3xs',
    xs: '3xs',
    s: '3xs',
    m: '2xs',
    l: 'xs',
};

export type TRatingViewMode = 'stars' | 'hearts';

interface IRatingOptions extends IControlProps, TInternalProps {
    value: number;
    precision?: TPrecision;
    readOnly?: boolean;
    iconSize?: IconSize;
    iconColorMode?: TIconColorMode;
    emptyIconFill?: TIconFill;
    onValueChanged?: Function;
    onPrecisionchanged?: Function;
    className?: string;
    maxValue?: number;
    viewMode?: TRatingViewMode;
}

/**
 * Базовый компонент оценок
 * Отображает выделенные звезды в зависимости от оценки
 * @remark
 * По умолчанию контейнер растягивается на ширину контента, так же контейнеру можно задать ширину, при этом звезды в
 * нем распределятся равномерно.
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2Fprogress%2FRating%2FIndex демо-пример}
 * @class Controls/progress:Rating
 * @implements Controls/interface:IControl
 * @implements Controls/progress:IRating
 * @public
 *
 * @demo Controls-demo/progress/Rating/Base/Index
 * @demo Controls-demo/progress/Rating/ContainerWidth/Index
 */

/*
 * Control of rating
 * Render highlighted stars depending on the rating
 * @class Controls/progress:Rating
 * @author Мочалов М.А.
 * @public
 *
 * @demo Controls-demo/progress/Rating/Index
 */
export default React.forwardRef(function Rating(props: IRatingOptions, ref): React.ReactElement {
    const {
        precision = 0,
        iconSize = DEFAULT_ICON_SIZE,
        iconColorMode = 'static',
        emptyIconFill = 'none',
        maxValue,
        viewMode,
    } = props;
    const [viewModel] = React.useState(
        new RatingViewModel({
            value: props.value,
            precision,
            iconColorMode,
            emptyIconFill,
            maxValue,
            viewMode,
        })
    );
    const [items, setItems] = React.useState(viewModel.getItems());
    const [touchStarted, setTouchStarted] = React.useState(false);
    const iconPadding = ICON_PADDINGS[iconSize];

    const readOnly = useReadonly(props);

    React.useEffect(() => {
        viewModel.setOptions({
            value: props.value,
            precision: props.precision ?? precision,
            iconColorMode: props.iconColorMode ?? iconColorMode,
            emptyIconFill: props.emptyIconFill ?? emptyIconFill,
            maxValue,
            viewMode,
        });
        setItems(viewModel.getItems());
    }, [props.value, props.precision, props.iconColorMode]);

    const onHoverStar = (
        event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        id: number
    ): React.MouseEventHandler => {
        if (!readOnly && !detection.isMobilePlatform && !touchStarted) {
            viewModel.setValue(id);
            setItems(viewModel.getItems());
        }
        return;
    };

    const onHoverOutStar = (): React.MouseEventHandler => {
        if (!readOnly && !detection.isMobilePlatform) {
            viewModel.setValue(props.value);
            setItems(viewModel.getItems());
        }
        return;
    };

    const touchStar = (
        event: React.TouchEvent<HTMLSpanElement>,
        id: number
    ): React.TouchEventHandler => {
        setTouchStarted(true);
        if (!readOnly && props.onValueChanged) {
            props.onValueChanged(event, props.value !== id ? id : 0);
        }
        return;
    };

    const clickStar = (
        event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        id: number
    ): React.MouseEventHandler => {
        if (touchStarted) {
            setTouchStarted(false);
            return;
        }
        if (!readOnly) {
            if (props.value !== id && props.onValueChanged) {
                props.onValueChanged(event, id);
            }
            if (props.onPrecisionChanged) {
                props.onPrecisionChanged(event, 0);
            }
        }
        return;
    };

    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const getAttrClass = () => {
        if (props.attrs?.className) {
            return props.attrs.className;
        } else if (props.className) {
            return props.className;
        }
        return '';
    };
    return (
        <div
            {...attrs}
            className={`controls-rating controls-rating-${
                readOnly ? 'read-only' : 'active'
            } ${getAttrClass()}`}
            ref={props.$wasabyRef}
        >
            {items.map((item) => {
                const itemClass =
                    `ws-flex-shrink-0 controls-icon controls-rating__star ${item.icon}` +
                    ` controls-padding_right-${iconPadding} controls-icon_size-${iconSize}` +
                    ` controls-icon_style-${item.iconStyle}`;
                return (
                    <span
                        className={itemClass}
                        data-qa={'rating__star'}
                        onMouseOver={(event) => {
                            onHoverStar(event, item.index);
                        }}
                        onMouseOut={onHoverOutStar}
                        onTouchStart={(event) => {
                            touchStar(event, item.index);
                        }}
                        onClick={(event) => {
                            clickStar(event, item.index);
                        }}
                        key={item.index}
                    ></span>
                );
            })}
        </div>
    );
});

/**
 * @name Controls/progress:Rating#value
 * @cfg {Number} Количество заполненных звезд
 * @demo Controls-demo/progress/Rating/Base/Index
 * @remark
 * Число от 1 до 5. Допускается ввод дробных чисел. Если десятичное значение value больше половины целого значения, и в precision установленно 0.5, то показывается пол.звезды.
 * @see Controls/progress:Rating#precision
 */
/*
 * @name Controls/progress:Rating#value
 * @cfg {Number} Number of highlighted stars
 * @remark
 * An float from 1 to 5.
 */
/**
 * @name Controls/progress:Rating#precision
 * @cfg {Number} Точность рейтинга
 * @variant 0 - отображение полностью закрашенных звезд
 * @variant 0.5 - отображение закрашенных на половину звезд
 * @default 0
 * @demo Controls-demo/progress/Rating/Base/Index
 * @remark
 * Если десятичное значение value больше половины целого значения, и в precision установленно 0.5, то показывается пол.звезды.
 * 3,44 – 3 звезды. 3,56 – 3 с половиной здезды
 */
/*
 * @name Controls/progress:Rating#precision
 * @cfg {Number} precision rating
 * @variant 0 - displays fully filled stars
 * @variant 0.5 - display half-filled stars
 * @ default 0
 * @remark
 * If the decimal "value" of value is more than half an integer value, and exactly 0.5 is set, then a half star is shown.
 * 3,44 – 3 highlighted stars. 3,56 – 3 with half highlighted stars
 */

/**
 * @name Controls/progress:Rating#iconSize
 * @cfg {String} Размер иконки звезды. При задании размеров иконки, меняется и расстояние между ними.
 * @variant default
 * @variant 2xs
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @see iconPadding
 * @demo Controls-demo/progress/Rating/IconSize/Index
 */

/**
 * @name Controls/progress:Rating#iconColorMode
 * @cfg {String} Режим окраски звезд
 * @variant static звезды закрашиваются одинаково, независимо от количества заполненных
 * @variant dynamic звезды закрашиваются в зависимости от количества заполненных
 * @see iconSize
 * @see iconPadding
 * @demo Controls-demo/progress/Rating/IconColorMode/Index
 */

/**
 * @name Controls/progress:Rating#emptyIconFill
 * @cfg {String} Заливка пустой звезды
 * @variant none Заливки нет, есть только контур
 * @variant full Заливка есть
 * @see iconPadding
 * @see iconSize
 * @demo Controls-demo/progress/Rating/EmptyIconFill/Index
 */

/**
 * @name Controls/progress:Rating#maxValue
 * @cfg {Number} Максимальное количество иконок. Минимальное количество - 2, максимальное - 5.
 * @default 5
 * @demo Controls-demo/progress/Rating/MaxValue/Index
 */

/**
 * @name Controls/progress:Rating#viewMode
 * @cfg {String} Тип отображаемой иконки.
 * @variant stars Звёзды
 * @variant hearts Сердца
 * @default stars
 * @demo Controls-demo/progress/Rating/ViewMode/Index
 */
