/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { TFontSize, TFontWeight } from 'Controls/interface';
import { useTheme } from 'UI/Contexts';
import { TemplateFunction } from 'UI/Base';
import { IHeading, IHeadingOptions, default as Heading } from './Heading';
import { SyntheticEvent } from 'Vdom/Vdom';
import Util from './Util';
import 'css!Controls/spoiler';

export interface IViewOptions extends IHeadingOptions {
    /**
     * @name Controls/_spoiler/IView#content
     * @cfg {String|TemplateFunction} Шаблон скрываемой области.
     * @demo Controls-demo/Spoiler/View/Content/Index
     */
    content: TemplateFunction | React.ReactElement;
    /**
     * @name Controls/_spoiler/IView#headerContentTemplate
     * @cfg {String|TemplateFunction} Контент, занимающий свободное пространство справа от заголовка. Если заголовка нет, то контент занимает все пространство шапки, в этом случае заголовок можно добавить вручную в любом месте.
     * @demo Controls-demo/Spoiler/Header/Index
     * @demo Controls-demo/Spoiler/HeaderRight/Index
     * @demo Controls-demo/Spoiler/HeadingLeft/Index
     */
    headerContentTemplate?: TemplateFunction | React.ReactElement;

    headingFontSize?: TFontSize;
    headingFontWeight?: TFontWeight;
    headingFontColorStyle?: string;
}

/**
 * Интерфейс опций контрола {@link Controls/spoiler:View}.
 *
 * @public
 */
export interface IView extends IHeading {
    readonly '[Controls/_spoiler/IView]': boolean;
}

/**
 * Графический контрол, отображаемый в виде заголовка с контентной областью.
 * Предоставляет пользователю возможность управления видимостью области при нажатии на заголовок.
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_spoiler.less переменные тем оформления}
 * * {@link http://axure.tensor.ru/StandardsV8/%D1%81%D0%BF%D0%BE%D0%B9%D0%BB%D0%B5%D1%80%D1%8B_%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%B0_%D1%81%D0%BF%D0%BE%D0%B9%D0%BB%D0%B5%D1%80%D0%BE%D0%B2.html стандарт}
 *
 * @class Controls/_spoiler/View
 * @extends Controls/interface:IControl
 * @implements Controls/interface:IExpandable
 * @implements Controls/spoiler:IHeading
 *
 * @public
 * @demo Controls-demo/Spoiler/View/Index
 */
export default React.forwardRef(function View(props: IViewOptions, ref) {
    const { captions = '', fontSize = 'm', captionPosition = 'right' } = props;
    const theme = useTheme(props);
    const [expanded, setExpanded] = React.useState<boolean>(Util._getExpanded(props, false));
    React.useEffect(() => {
        setExpanded(Util._getExpanded(props, expanded));
    }, [props.expanded]);

    const expandedHandler = (arg1, arg2) => {
        const event = new SyntheticEvent(null, {
            type: 'expandedChanged',
        });
        // на стороне ядра есть проблема, когда 1 аргументом может прийти event, а может и состояние
        // Поэтому явно смотрим есть ли 2 аргумент, и если есть, то берем его
        let state = arg1;
        if (typeof arg2 !== 'undefined') {
            state = arg2;
        }
        props.onExpandedChanged?.(event, state);
        props.onExpandedchanged?.(event, state);
        setExpanded(state);
    };

    const attrs = wasabyAttrsToReactDom(props.attrs) || {};
    return (
        <div
            ref={ref}
            {...attrs}
            className={`controls_spoiler_theme-${theme} controls-SpoilerView ${props.className}`}
        >
            <div className="controls-SpoilerView__header ws-flexbox ws-align-items-baseline">
                {captions && (
                    <Heading
                        className="controls-SpoilerView__heading ws-flex-row"
                        expanded={expanded}
                        captions={captions}
                        captionPosition={captionPosition}
                        fontSize={props.headingFontSize || fontSize}
                        fontWeight={props.headingFontWeight}
                        fontColorStyle={props.headingFontColorStyle}
                        tooltip={props.tooltip}
                        onExpandedChanged={expandedHandler}
                    />
                )}
                {props.headerContentTemplate ? (
                    props.headerContentTemplate.isWasabyTemplate ? (
                        <props.headerContentTemplate
                            onExpandedChanged={expandedHandler}
                            customEvents={['onExpandedChanged']}
                        />
                    ) : (
                        React.cloneElement(props.headerContentTemplate, {
                            ...props.headerContentTemplate.props,
                            onExpandedChanged: expandedHandler,
                            customEvents: ['onExpandedChanged'],
                        })
                    )
                ) : null}
            </div>
            {expanded &&
                (props.content.isWasabyTemplate ? (
                    <props.content className="controls-SpoilerView__area" />
                ) : (
                    React.cloneElement(props.content, {
                        ...props.content.props,
                        className: 'controls-SpoilerView__area',
                    })
                ))}
        </div>
    );
});

/**
 * @name Controls/_spoiler/View#headingFontSize
 * @cfg {Controls/interface:IFontSize} Размер шрифта заголовка.
 * @see Controls/spoiler:Heading#fontSize
 */
/**
 * @name Controls/_spoiler/View#headingFontWeight
 * @cfg {Controls/interface:IFontWeight} Насыщенность шрифта заголовка.
 * @see Controls/spoiler:Heading#fontWeight
 */
/**
 * @name Controls/_spoiler/View#headingFontColorStyle
 * @cfg {Controls/interface:IFontColorStyle} Стиль цвета текста и иконки заголовка.
 * @see Controls/spoiler:Heading#fontColorStyle
 */
