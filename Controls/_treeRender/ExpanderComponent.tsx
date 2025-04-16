/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import type { TExpanderPosition, TExpanderVisibility, TreeItem } from 'Controls/baseTree';
import type {
    TExpanderIconSize,
    TExpanderIconStyle,
    TExpanderPaddingVisibility,
    TSize,
} from 'Controls/interface';
import {
    CollectionItemContext,
    hooks,
    ICollectionItemContextValue,
} from 'Controls/listsCommonLogic';
import { Logger } from 'UI/Utils';

const { useObservableItemStates } = hooks;

const SIZES = ['null', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];

/**
 * Варианты стиля отображения иконки для всех узлов и скрытых узлов дерева.
 * @typedef TExpanderIconViewMode
 * @variant none Иконки всех узлов и скрытых узлов не отображаются.
 * @variant node Иконка, используемая для отображения в узле.
 * @variant unaccentedNode Иконка, используемая для отображения в узле, отличается от node менее акцентным цветом, необходима тогда, когда по стилю требуется использовать менее яркие цвета.
 * @variant hiddenNode Иконка, используемая для отображения в "скрытом" узле.
 * @variant emptyNode Иконка, используемая для отображения в пустом узле.
 * @default undefined
 */
type TExpanderIconViewMode =
    | 'none'
    | 'node'
    | 'unaccentedNode'
    | 'hiddenNode'
    | 'emptyNode'
    | undefined;

/**
 * Базовые свойства компонента "Кнопка разворота узла".
 * @public
 */
interface IBaseExpanderProps {
    /**
     * Размер области, который отведён под иконку узла или скрытого узла.
     * @default s
     * @remark
     * Размер области xs рекомендуется задавать только вместе с иконкой разворота {@link Controls/baseTree/IExpanderProps/Property/expanderIconSize размера} 2xs
     * @see expanderIcon
     * @see expanderIconSize
     * @see expanderVisibility
     */
    expanderSize?: TSize;
    /**
     * Стиль отображения иконки для всех узлов и скрытых узлов дерева.
     * @default undefined
     * @remark
     * Когда в опции задано undefined, используются иконки узлов и скрытых узлов.
     * @see expanderSize
     * @see expanderVisibility
     */
    expanderIcon?: TExpanderIconViewMode;
    /**
     * Размер иконки разворота узла дерева
     * @default default
     * @see expanderSize
     */
    expanderIconSize?: TExpanderIconSize;
    /**
     * Стиль иконки разворота узла дерева
     * @remark
     * Использовать только в крайних случаях, по письменному согласованию с Батуриной Н.
     * @default default
     */
    expanderIconStyle?: TExpanderIconStyle;
    /**
     * Расположение иконки для узла и скрытого узла.
     * @default default
     */
    expanderPosition?: TExpanderPosition;

    /**
     * Режим отображения отступа вместо иконки разворота.
     */
    expanderPaddingVisibility?: TExpanderPaddingVisibility;
    /**
     * Принудительно скрывать отступ под иконку экспандера.
     */
    withoutExpanderPadding?: boolean;
    /**
     * Размер структурного отступа для элементов иерархии.
     * @remark
     * Каждому значению опции соответствует размер в px. Он зависит от {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/paddings/#hierarchical-indentation здесь}.
     * @default s
     * @see withoutLevelPadding
     */
    levelIndentSize?: TSize;
    /**
     * Флаг, позволяющий отключить {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/paddings/ иерархический отступ}.
     * @default false
     */
    withoutLevelPadding?: boolean;
    /**
     * Флаг наличия дочерних записей у отображаемого узла.
     */
    hasChildren?: boolean;
}

interface IExpanderEventHandlersProps {
    onClick?: React.MouseEventHandler<MouseEvent>;
    onMouseDown?: React.MouseEventHandler<MouseEvent>;
}

interface ILevelPaddingsComponentProps {
    level: number;
    levelIndentSize?: TSize;
    withoutLevelPadding?: boolean;
    expanderPosition?: TExpanderPosition;
    expanderSize?: TSize;
}

interface IInnerExpanderProps
    extends TInternalProps,
        ILevelPaddingsComponentProps,
        IBaseExpanderProps,
        IExpanderEventHandlersProps {
    node: boolean | null;
    expanded: boolean;

    expanderVisibility: TExpanderVisibility;

    directionality?: string;
    className?: string;
    style?: string;

    // TODO нужно править data-qa
    dataQaPrefix?: string;
}

const validateExpanderIcon = (icon: any): icon is TExpanderIconViewMode => {
    const validIcons: TExpanderIconViewMode[] = [
        'node',
        'hiddenNode',
        'emptyNode',
        'none',
        'unaccentedNode',
    ];
    return validIcons.includes(icon);
};

function getExpanderProps<TItem extends TreeItem = TreeItem>(
    props: IBaseExpanderProps,
    item: TItem
): IInnerExpanderProps {
    const rowProps = item?.getRowProps?.();
    return {
        expanderSize: item.getExpanderSize(props.expanderSize || rowProps?.expanderSize),
        expanderIcon: item.getExpanderIcon(props.expanderIcon),
        expanderIconSize: item.getExpanderIconSize(props.expanderIconSize),
        expanderIconStyle: item.getExpanderIconStyle(props.expanderIconStyle),
        expanderPaddingVisibility: props.expanderPaddingVisibility,
        withoutExpanderPadding: item.getWithoutExpanderPadding(
            props.withoutExpanderPadding,
            props.expanderSize
        ),
        levelIndentSize: props.levelIndentSize || rowProps?.levelIndentSize,
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

function getExpanderClassName(props: IInnerExpanderProps): string {
    const expanderSize = props.expanderSize || 'default';
    const expanderPosition = props.expanderPosition;

    let expanderIcon = props.expanderIcon || (props.node ? 'node' : 'hiddenNode');
    if (!validateExpanderIcon(expanderIcon)) {
        Logger.warn(
            `WARNING: expanderIcon получил неожиданное значение: ${expanderIcon}. использовать только для установки своей иконки, убедитесь что вам это нужно`
        );
    }

    let expanderIconSize: TExpanderIconSize | 'master' = 'default';
    let expanderIconStyle: TExpanderIconStyle =
        expanderIcon === 'hiddenNode' || expanderIcon === 'unaccentedNode'
            ? 'unaccented'
            : 'default';

    if (
        expanderSize === 'xs' &&
        (expanderIcon === 'node' ||
            expanderIcon === 'unaccentedNode' ||
            expanderIcon === 'hiddenNode')
    ) {
        expanderIconSize = '2xs';
        expanderIconStyle = 'unaccented';
    }

    if (
        props.style === 'master' &&
        (expanderIcon === 'node' ||
            expanderIcon === 'unaccentedNode' ||
            expanderIcon === 'hiddenNode')
    ) {
        expanderIconSize = expanderPosition === 'default' ? 'master' : 'default';
        expanderIconStyle = 'unaccented';
    }

    if (expanderPosition === 'right' && expanderIcon === 'hiddenNode') {
        expanderIconStyle = 'right';
    }

    expanderIcon = expanderIcon === 'unaccentedNode' ? 'node' : expanderIcon;

    //WARNING Перебиваем все установленные цвета
    if (props.expanderIconStyle) {
        Logger.warn(
            'WARNING: Значение переданное в опцию expanderIconStyle перебивает все заготовленные цвета иконки экспандера. УБЕДИТЕСЬ что это необходимо.'
        );
        expanderIconStyle = props.expanderIconStyle;
    }
    //WARNING Задали размер через expanderIconSize
    if (props.expanderIconSize) {
        Logger.warn(
            'WARNING: Значение переданное в опцию expanderIconSize перебивает естественный размер иконки. УБЕДИТЕСЬ что это необходимо.'
        );
        expanderIconSize = props.expanderIconSize;
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

function shouldDisplayExpander(props: IInnerExpanderProps): boolean {
    if (props.expanderIcon === 'none' || props.node === null) {
        return false;
    }
    return props.expanderVisibility === 'visible' || props.hasChildren;
}

function shouldDisplayExpanderPadding(props: IInnerExpanderProps): boolean {
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

function getExpanderPaddingClassName(props: IInnerExpanderProps): string {
    // expanderSize по дефолту undefined, т.к. есть логика, при которой если он задан,
    // то скрытый экспандер для отступа не рисуем, но по факту дефолтное значение 'default'
    const expanderSize = props.expanderSize || 'default';
    let className = 'controls-Tree__row-expanderPadding tw-flex-shrink-0 tw-invisible';
    className += ` controls-TreeGrid__row-expanderPadding_size_${expanderSize}`;
    className += ' js-controls-ListView__notEditable';
    return className;
}

function ExpanderComponent(props: IInnerExpanderProps): React.ReactElement | null {
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

function LevelPaddingsComponent(props: ILevelPaddingsComponentProps): React.ReactElement | null {
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
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{levelPaddings}</>;
}

function ExpanderBlockComponent(props: IInnerExpanderProps): React.ReactElement {
    const className = `tw-flex tw-items-baseline ${props.className || ''}`;
    const { item } = React.useContext(CollectionItemContext) as ICollectionItemContextValue;
    const Expander = item ? ExpanderConnectedComponent : ExpanderComponent;
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
            {isDefaultPosition && <Expander {...props} className={undefined} />}
            {shouldDisplayExpanderPadding(props) && (
                <div className={getExpanderPaddingClassName(props)} />
            )}
        </div>
    );
}

/**
 * Свойства компонента "Кнопка разворота узла".
 * @public
 */
interface IExpanderConnectedComponentProps extends IBaseExpanderProps, IExpanderEventHandlersProps {
    /**
     * Произвольный CSS класс
     */
    className?: string;
}

/**
 * Компонент "Кнопка разворота узла".
 * При размещении в пользовательском рендере ячейки позволяет разворачивать и сворачивать узел.
 * Управление узлом дерева происходит через контекст строки, распространяемый Controls/grid.
 * @param props
 */
function ExpanderConnectedComponent(props: IExpanderConnectedComponentProps) {
    // Пробовали вынести отслеживание expanded в отдельный хук, не получилось. Пока нет времени разбираться подробно.
    // Предположительно, данная особенность React описана тут:
    // https://stackoverflow.com/questions/70927358/why-does-a-custom-hook-that-uses-another-hooks-value-via-usecontext-only-shows-i
    // test-case:
    // ViewConfiguration.new.list.test_new_view_configuration_list.TestNewViewConfigurationList.test_marker_regression_select

    const collectionItemContextValue = React.useContext(
        CollectionItemContext
    ) as ICollectionItemContextValue;
    const item = collectionItemContextValue.item as unknown as TreeItem;
    useObservableItemStates(['expanded']);

    return (
        <ExpanderComponent
            {...getExpanderProps(props, item)}
            onClick={props.onClick}
            onMouseDown={props.onMouseDown}
            className={props.className}
            expanded={item && item.isExpanded()}
        />
    );
}

// Внутренний компонент, используемый в совместимости с WML
export function CustomExpanderConnectedComponent(props: IExpanderConnectedComponentProps) {
    const collectionItemContextValue = React.useContext(
        CollectionItemContext
    ) as ICollectionItemContextValue;
    const item = collectionItemContextValue.item as unknown as TreeItem;
    if (item.getExpanderPosition() !== 'custom') {
        return null;
    }

    return <ExpanderConnectedComponent {...props} />;
}

export {
    ExpanderConnectedComponent,
    ExpanderComponent,
    LevelPaddingsComponent,
    ExpanderBlockComponent,
    IBaseExpanderProps,
    IExpanderConnectedComponentProps,
    IExpanderConnectedComponentProps as IExpanderProps,
    TExpanderIconViewMode,
    getExpanderProps,
};
