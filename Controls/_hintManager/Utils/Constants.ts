/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */

const HINT_TARGETS_CONTAINER_ID = 'hintTargets';
const HINT_TARGETS_CONTAINER_CLASS = 'controls-HintTargetsContainer';
const TARGET_HIGHLIGHTER_CLASS = 'controls-HintTargetHighlighter';
const TARGET_ACTIVE_HIGHLIGHT_CLASS_PREFIX = 'controls-HintTargetHighlighter_active';

const TARGET_HIGHLIGHTER_BORDER_SIZE = 2;
const DEFAULT_TARGET_HIGHLIGHTER_OFFSET = 2;

// Минимальные высота или ширина таргета в px, при которых он обрабатывается в качестве целевого элемента подсказки.
const MIN_TARGET_SIZE = 3;

const TYPE_PREFIX = '-type-';
const TEXT_PREFIX = '-text-';

// Префикс, который включают в себя targetId элементов, находящихся внутри произвольных всплывающих окон.
const POPUP_TYPE_PREFIX = 'popup';

// TODO: Разработать API взаимодействия с окнами в рамках проекта:
// https://online.sbis.ru/opendoc.html?guid=4dd3b6d7-e8cd-4332-b332-8ad3cec887e0&client=3
const POPUP_CLASS = 'controls-Popup';
const POPUP_TEMPLATE_CLASS = 'controls-Popup__template';
const STICKY_TEMPLATE_CLASS = 'controls-StickyTemplate';

// Список классов элементов внутри popup-окон, для которых запрещена разметка в рамках текущей сущности.
const EXCEPTION_POPUP_LIST = ['controls-Stack__content-wrapper', 'controls-ConfirmationTemplate'];

// Стандартный стиль для подсказок и обводки
const DEFAULT_STYLE = 'info';

export {
    HINT_TARGETS_CONTAINER_ID,
    HINT_TARGETS_CONTAINER_CLASS,
    TARGET_HIGHLIGHTER_CLASS,
    TARGET_ACTIVE_HIGHLIGHT_CLASS_PREFIX,
    TARGET_HIGHLIGHTER_BORDER_SIZE,
    DEFAULT_TARGET_HIGHLIGHTER_OFFSET,
    MIN_TARGET_SIZE,
    TYPE_PREFIX,
    TEXT_PREFIX,
    POPUP_TYPE_PREFIX,
    POPUP_CLASS,
    POPUP_TEMPLATE_CLASS,
    STICKY_TEMPLATE_CLASS,
    EXCEPTION_POPUP_LIST,
    DEFAULT_STYLE,
};
