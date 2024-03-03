import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { TExpanderPosition, TExpanderVisibility, TreeItem } from 'Controls/baseTree';
import {
    TExpanderIconSize,
    TExpanderIconStyle,
    TExpanderPaddingVisibility,
    TSize,
} from 'Controls/interface';

const SIZES = ['null', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];

export interface IBaseExpanderProps {
    expanderSize?: TSize;
    expanderIcon?: string;
    expanderIconSize?: TExpanderIconSize;
    expanderIconStyle?: TExpanderIconStyle;
    expanderPosition?: TExpanderPosition;

    expanderPaddingVisibility?: TExpanderPaddingVisibility;
    withoutExpanderPadding?: boolean;

    levelIndentSize?: TSize;
    withoutLevelPadding?: boolean;
    hasChildren?: boolean;
}

interface ILevelPaddingsComponentProps {
    level: number;
    levelIndentSize?: TSize;
    withoutLevelPadding?: boolean;
    expanderPosition?: TExpanderPosition;
    expanderSize?: TSize;
}

interface IExpanderProps extends TInternalProps, IBaseExpanderProps, ILevelPaddingsComponentProps {
    node: boolean | null;
    expanded: boolean;

    expanderVisibility: TExpanderVisibility;
    expanderPosition?: TExpanderPosition;

    directionality?: string;
    className?: string;
    style?: string;

    // TODO нужно править data-qa
    dataQaPrefix?: string;
}

function getExpanderProps<TItem extends TreeItem = TreeItem>(
    props: IBaseExpanderProps,
    item: TItem
): IExpanderProps {
    return {
        expanderSize: item.getExpanderSize(props.expanderSize),
        expanderIcon: item.getExpanderIcon(props.expanderIcon),
        expanderIconSize: item.getExpanderIconSize(props.expanderIconSize),
        expanderIconStyle: item.getExpanderIconStyle(props.expanderIconStyle),
        expanderPaddingVisibility: props.expanderPaddingVisibility,
        withoutExpanderPadding: item.getWithoutExpanderPadding(
            props.withoutExpanderPadding,
            props.expanderSize
        ),
        levelIndentSize: props.levelIndentSize,
        withoutLevelPadding: item.getWithoutLevelPadding(props.withoutLevelPadding),
        expanderPosition: item.getExpanderPosition(),
        expanderVisibility: item.getExpanderVisibility(),
        directionality: item.getDirectionality(),
        style: item.getStyle(),
        level: item.getLevel(),
        expanded: item.isExpanded(),
        node: item.isNode(),
        hasChildren: item.getHasChildrenProperty()
            ? item.hasChildren()
            : item.hasChildrenByRecordSet(),
        dataQaPrefix: item.listElementName,
    };
}

function getExpanderClassName(props: IExpanderProps): string {
    const expanderIcon = props.expanderIcon || (props.node ? 'node' : 'hiddenNode');
    const expanderSize = props.expanderSize || 'default';
    const expanderPosition = props.expanderPosition;

    let expanderIconSize: TExpanderIconSize | 'master';
    let expanderIconStyle;

    if (props.style === 'master') {
        expanderIconSize = expanderPosition === 'default' ? 'master' : 'default';
        expanderIconStyle =
            props.expanderIconStyle && props.expanderIconStyle !== 'default'
                ? props.expanderIconStyle
                : 'unaccented';
    } else {
        expanderIconSize = props.expanderIconSize;
        expanderIconStyle = props.expanderIconStyle;
    }

    // Если отображается иконка для скрытого узла в стиле default, то по умолчанию
    // перебиваем default на unaccented. Т.к. раньше hiddenNode всегда отображалась
    // только в стиле unaccented. А сейчас возможны 2 варианта 'readonly' и 'unaccented'
    if (expanderIcon === 'hiddenNode' && expanderIconStyle === 'default') {
        if (expanderPosition === 'right') {
            expanderIconStyle = 'right';
        } else {
            expanderIconStyle = 'unaccented';
        }
    }

    let expanderClasses = 'js-controls-Tree__row-expander controls-TreeGrid__row-expander';
    if (expanderIconStyle !== 'readonly') {
        expanderClasses += ' controls-cursor_pointer';
    }

    expanderClasses += ' js-controls-ListView__notEditable';

    if (expanderPosition === 'default') {
        expanderClasses += ` controls-TreeGrid__row_${props.style}-expander_size_${expanderSize}`;
        expanderClasses += ' tw-inline-flex tw-items-center tw-flex-shrink-0';
        if (expanderSize !== 'xs') {
            expanderClasses += ' tw-justify-center';
        }
    } else {
        expanderClasses += ' tw-inline-block';
    }
    if (expanderPosition === 'right') {
        expanderClasses += ' controls-padding_left-xs';
    }

    const style = props.style === 'master' && expanderPosition !== 'right' ? 'master' : 'default';

    let expanderIconClass = ` controls-TreeGrid__row-expander_${expanderIcon}`;
    if (expanderIcon === 'node' || expanderIcon === 'hiddenNode' || expanderIcon === 'emptyNode') {
        expanderIconClass += `_${style}`;
    }

    expanderClasses += ` controls-TreeGrid__row-expander_${expanderIcon}_${style}_position_${expanderPosition}`;
    expanderClasses += expanderIconClass;

    expanderClasses += ` controls-TreeGrid__row-expander_${expanderIcon}_iconSize_${expanderIconSize}`;
    expanderClasses += ` controls-TreeGrid__row-expander_${expanderIcon}_iconStyle_${expanderIconStyle}`;

    if (props.directionality === 'rtl') {
        expanderClasses += ' controls-TreeGrid__row-expander_reverse';
    }

    // TODO нужно заменить на data-qa
    // добавляем класс свертнутости развернутости для тестов
    expanderClasses +=
        ' controls-TreeGrid__row-expander' + (props.expanded ? '_expanded' : '_collapsed');
    // добавляем класс свертнутости развернутости стилевой
    expanderClasses += expanderIconClass + (props.expanded ? '_expanded' : '_collapsed');

    return expanderClasses;
}

function shouldDisplayExpander(props: IExpanderProps): boolean {
    if (props.expanderIcon === 'none' || props.node === null) {
        return false;
    }
    return props.expanderVisibility === 'visible' || props.hasChildren;
}

function shouldDisplayExpanderPadding(props: IExpanderProps): boolean {
    if (shouldDisplayExpander(props) || props.expanderPosition !== 'default') {
        return false;
    }

    // У узлов отступ под экспандер должен быть всегда, а вот у листьев его могут убрать.
    // Например, если у листьев отображается картинка, то она может отображаться на месте экспандера.
    // нельзя заюзать _$displayExpanderPadding, т.к. экспандер могут скрыть для определенной записи
    return (
        (props.node !== null || !props.withoutExpanderPadding) &&
        props.expanderIcon !== 'none' &&
        props.expanderPosition === 'default'
    );
}

function getExpanderPaddingClassName(props: IExpanderProps): string {
    // expanderSize по дефолту undefined, т.к. есть логика, при которой если он задан,
    // то скрытый экспандер для отступа не рисуем, но по факту дефолтное значение 'default'
    const expanderSize = props.expanderSize || 'default';
    let className = 'controls-Tree__row-expanderPadding tw-flex-shrink-0 tw-invisible';
    className += ` controls-TreeGrid__row-expanderPadding_size_${expanderSize}`;
    className += ' js-controls-ListView__notEditable';
    return className;
}

function ExpanderComponent(
    props: IExpanderProps & {
        onMouseDown?: React.EventHandler<React.SyntheticEvent>;
    }
): React.ReactElement {
    if (!shouldDisplayExpander(props)) {
        return null;
    }

    let className = getExpanderClassName(props);
    if (props.className) {
        className += ` ${props.className}`;
    } else if (props.attrs?.className) {
        className += ` ${props.attrs.className}`;
    }
    return (
        <div
            ref={props.ref}
            className={className}
            data-qa={`${props.dataQaPrefix}-expander`}
            tabIndex={-1}
            onMouseDown={props.onMouseDown}
        />
    );
}

function LevelPaddingsComponent(props: ILevelPaddingsComponentProps): React.ReactElement {
    if (props.withoutLevelPadding || props.level <= 1) {
        return null;
    }

    let levelIndentSize;
    if (props.expanderSize && props.levelIndentSize) {
        // Если позиция экспандера не дефолтная, то нужно смотреть в первую очередь на levelIndentSize
        if (
            SIZES.indexOf(props.expanderSize) >= SIZES.indexOf(props.levelIndentSize) &&
            props.expanderPosition === 'default'
        ) {
            levelIndentSize = props.expanderSize;
        } else {
            levelIndentSize = props.levelIndentSize;
        }
    } else if (!props.expanderSize && !props.levelIndentSize) {
        levelIndentSize = 'default';
    } else {
        levelIndentSize = props.expanderSize || props.levelIndentSize;
    }

    const className = `tw-flex-shrink-0 tw-inline-block controls-TreeGrid__row-levelPadding_size_${levelIndentSize}`;

    const levelPaddings = [];
    for (let i = 0; i < props.level - 1; i++) {
        levelPaddings.push(<div key={i} className={className} />);
    }
    return levelPaddings;
}

function ExpanderBlockComponent(props: IExpanderProps): React.ReactElement {
    const className = `tw-flex tw-items-baseline ${props.className || ''}`;
    const isDefaultPosition = props.expanderPosition === 'default';
    return (
        <div className={className} data-qa={'expander-block'}>
            <LevelPaddingsComponent
                level={props.level}
                levelIndentSize={props.levelIndentSize}
                withoutLevelPadding={props.withoutLevelPadding}
                expanderPosition={props.expanderPosition}
                expanderSize={props.expanderSize}
            />
            {isDefaultPosition && <ExpanderComponent {...props} className={undefined} />}
            {shouldDisplayExpanderPadding(props) && (
                <div className={getExpanderPaddingClassName(props)} />
            )}
        </div>
    );
}

export {
    ExpanderComponent,
    LevelPaddingsComponent,
    ExpanderBlockComponent,
    IBaseExpanderProps as IExpanderProps,
    getExpanderProps,
};
