/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { TFontSize, TFontWeight } from 'Controls/interface';
import { useTheme, getWasabyContext } from 'UI/Contexts';
import { TemplateFunction } from 'UI/Base';
import { IHeading, IHeadingOptions, default as Heading } from './Heading';
import { SyntheticEvent } from 'Vdom/Vdom';
import Util from './Util';
import 'css!Controls/spoiler';
import { constants } from 'Env/Env';

export interface IViewOptions extends IHeadingOptions {
    /**
     * @name Controls/_spoiler/IView#content
     * @cfg {String|TemplateFunction} Шаблон скрываемой области.
     * @demo Controls-demo/Spoiler/View/Content/Index
     */
    content: TemplateFunction | React.ReactElement;
    children: React.ReactElement;
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
    onKeyDown?: (e: React.SyntheticEvent<React.KeyboardEvent>) => void;
    tabIndex?: number;
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
    const {captions = '', fontSize = 'm', captionPosition = 'right'} = props;
    const theme = useTheme(props);
    const [expanded, setExpanded] = React.useState<boolean>(Util._getExpanded(props, false));
    const [contentVisibility, setContentVisibility] = React.useState<boolean>(expanded);
    const context = React.useContext(getWasabyContext());
    React.useEffect(() => {
        const expandedValue = Util._getExpanded(props, expanded);
        setExpanded(expandedValue);
        if (expandedValue && !contentVisibility) {
            setContentVisibility(expandedValue);
        }
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
        setExpanded(state);
        setContentVisibility(true);
    };

    const onKeyDownHandler = (e: React.SyntheticEvent<React.KeyboardEvent>) => {
        if (e.nativeEvent.keyCode === constants.key.space && !props.readOnly) {
            e.preventDefault();
            setExpanded(!expanded);
            setContentVisibility(true);
        }
        if (props.onKeyDown) {
            props.onKeyDown(e);
        }
    };

    const attrs = wasabyAttrsToReactDom(props.attrs) || {};

    let className = `controls_spoiler_theme-${theme} controls-SpoilerView`;
    if (props.className) {
        className += ' ' + props.className;
    }

    const ContentTemplate = props.children || props.content;
    const contentClassName = `controls-SpoilerView__area controls-SpoilerView__area-${
        expanded ? 'visible' : 'hidden'
    } ${ContentTemplate?.props?.className && `${ContentTemplate?.props?.className}`}`;

    return (
        <div ref={ref} onKeyDown={onKeyDownHandler} {...attrs} className={className}>
            <div className={'controls-SpoilerView__header ws-flexbox ws-align-items-baseline' +
                ((context && context.workByKeyboard) ? ' controls-focused-item' : '')}
                 tabIndex={props.tabIndex}
            >
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
            {contentVisibility &&
                (ContentTemplate.isWasabyTemplate ? (
                        <ContentTemplate className={contentClassName} attrs={{className: contentClassName}}/>
                    ) : (
                        React.cloneElement(ContentTemplate, {
                            ...ContentTemplate.props,
                            className: contentClassName,
                        })
                    )
                )
            }
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
