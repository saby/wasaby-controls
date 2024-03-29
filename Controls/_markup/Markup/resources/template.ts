/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { TClosure as thelpers } from 'UI/Executor';
import validHtml = require('Core/validHtml');
import { Logger } from 'UI/Utils';
import { constants } from 'Env/Env';
import { object } from 'Types/util';

/* eslint-disable */
const lowerValidNodes = Object.assign(
    ...Object.keys(validHtml.validNodes).map((key) => {
        return { [key.toLowerCase()]: validHtml.validNodes[key] };
    })
);

const lowerValidAttributes = Object.assign(
    ...Object.keys(validHtml.validAttributes).map((key) => {
        return { [key.toLowerCase()]: validHtml.validAttributes[key] };
    })
);

const EMOJI_CLASS_NAME = 'LinkDecorator__emoji';

const EMOJI_REGEX =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+/g;

const MAX_STRING_LENGTH_FOR_REGEX = 2048;

const lowerValidHtml = {
    validNodes: lowerValidNodes,
    validAttributes: lowerValidAttributes,
};

let markupGenerator,
    defCollection,
    control,
    resolver,
    resolverParams,
    resolverMode,
    currentValidHtml,
    linkAttributesMap = {
        action: true,
        background: true,
        cite: true,
        codebase: true,
        formaction: true,
        href: true,
        icon: true,
        longdesc: true,
        manifest: true,
        poster: true,
        profile: true,
        src: true,
        usemap: true,
    },
    startOfGoodLinks = [
        'data:image(//|/)[^;]+;base64[^"]+',
        'http:(//|\\\\)',
        'https:(//|\\\\)',
        'ftp:(//|\\\\)',
        'file:(//|\\\\)',
        'smb:(//|\\\\)',
        'mailto:',
        'tel:',
        'viber:(//|\\\\)',
        'sbisplugin:(//|\\\\)',
        'Notes:(//|\\\\)',
        'notes:(//|\\\\)',
        '#',
        './',
        '/',
    ],
    goodLinkAttributeRegExp = new RegExp(
        `^(${startOfGoodLinks.join('|')})`.replace(
            /[a-z]/g,
            (m) => `[${m + m.toUpperCase()}]`
        )
    ),
    dataAttributeRegExp = /^data-(?!component$|bind$)([\w-]*[\w])+$/,
    additionalNotVdomEscapeRegExp = /(\u00a0)|(&#)/g;

const attributesWhiteListForEscaping = ['style'];

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

function isKeyExist(obj: object, find: string = ''): boolean {
    const keys = Object.keys(obj).map((key) => key.toLowerCase());
    const soughtKey = find.toLowerCase();
    return keys.includes(soughtKey) ? obj[soughtKey] || obj[find] : false;
}

function logError(text: string, node?: any[] | string | object) {
    let strNode: string;
    try {
        strNode = JSON.stringify(node);
    } catch (e) {
        strNode = '"Невалидный Json узел"';
    }

    Logger.error(
        'UI/Executor:TClosure' +
            `Ошибка разбора JsonML: ${text}. Ошибочный узел: ${strNode}`,
        control
    );
}

function generateEventSubscribeObject(handlerName) {
    return {
        name: 'event',
        args: [],
        value: handlerName,
        fn: (function (self) {
            const f = function () {
                const event = arguments[0];
                event.result = thelpers
                    .getter(this, [handlerName])
                    .apply(this, arguments);
            }.bind(self);
            f.control = self;
            f.isControlEvent = false;
            return f;
        })(control),
    };
}

function addEventListener(events, eventName, handlerName) {
    if (!events[eventName]) {
        events[eventName] = [];
    }
    events[eventName].push(generateEventSubscribeObject(handlerName));
}

function isBadLinkAttribute(attributeName, attributeValue) {
    // Регулярное выражение падает с ошибкой "maximum call stack size exceeded" на слишком длинных строках.
    // В качестве длинной строки может быть base64-строка изображения.
    // Опытным путем было обнаружено, что строка с длиной, превышающей 4194302,
    // приводит к ошибке при парсинге регуляркой.
    //
    // Конкретно здесь регулярка проверяет ссылку на корректность,
    // но нет смысла проверять слишком длинные строки,
    // так как современные браузеры не воспринимают ссылки с длиной, превышающей 2048.
    const stringForRegex =
        typeof attributeValue !== 'string'
            ? attributeValue
            : attributeValue.substring(0, MAX_STRING_LENGTH_FOR_REGEX);
    return (
        linkAttributesMap[attributeName] &&
        !goodLinkAttributeRegExp.test(stringForRegex)
    );
}

function validAttributesInsertion(
    targetAttributes: object,
    sourceAttributes: object,
    additionalValidAttributes?: object
) {
    const validAttributes: Object = currentValidHtml.validAttributes;
    for (const attributeName in sourceAttributes) {
        if (!sourceAttributes.hasOwnProperty(attributeName)) {
            continue;
        }
        const sourceAttributeValue = isKeyExist(
            sourceAttributes,
            attributeName
        );

        // На атрибут onError можно устанавливать функцию-обработчик в опции tagResolver.
        if (attributeName !== 'onError' && !isString(sourceAttributeValue)) {
            logError(
                `Невалидное значение атрибута ${attributeName}, ожидается строковое значение`,
                sourceAttributes
            );
            continue;
        }
        const isStrictValid = isKeyExist(validAttributes, attributeName);
        const isAdditionalValid =
            additionalValidAttributes &&
            isKeyExist(additionalValidAttributes, attributeName);
        if (
            !isStrictValid &&
            !isAdditionalValid &&
            !dataAttributeRegExp.test(attributeName)
        ) {
            continue;
        }

        // Разрешаем только ссылочные атрибуты с безопасным началом, чтобы избежать XSS.
        if (isBadLinkAttribute(attributeName, sourceAttributeValue)) {
            continue;
        }

        if (attributesWhiteListForEscaping.includes(attributeName)) {
            targetAttributes[attributeName] = sourceAttributeValue;
        } else {
            targetAttributes[attributeName] =
                markupGenerator.escape(sourceAttributeValue);
        }
    }
}

function recursiveMarkup(
    attr,
    data,
    context,
    isVdom,
    value,
    attrsToDecorate,
    key,
    parent?,
    options?
) {
    let valueToBuild = value,
        valueAfterEmojisParse = value,
        wasResolved,
        i,
        templateCount = 0;

    if (valueToBuild && Array.isArray(valueToBuild)) {
        valueToBuild = parseEmojis(valueToBuild);
        valueAfterEmojisParse = valueToBuild;
    }

    valueToBuild =
        resolverMode && resolver
            ? resolver(valueToBuild, parent, resolverParams)
            : valueToBuild;

    if (isString(valueToBuild)) {
        if (!resolver || !resolver.__noNeedEscapeString) {
            valueToBuild = markupGenerator.escape(valueToBuild);
        }
        // Геренатор не умеет работать с классом String, только с примитивной строкой,
        // поэтому всегда принудительно конвертируем в примитив.
        valueToBuild = valueToBuild.toString();
        return markupGenerator.createText(valueToBuild, key);
    }
    if (!valueToBuild) {
        return [];
    }
    if (isString(valueToBuild[0]) && valueToBuild[0].includes('component:')) {
        const valueToBuildPaths = valueToBuild[0].split(':').slice(1).join(':');
        return markupGenerator.createControlNew(
            'resolver',
            options[valueToBuildPaths] ?? valueToBuildPaths,
            {},
            {},
            valueToBuild[1], // опции компонента
            {
                attr: attr,
                data: data,
                ctx: this,
                isVdom: isVdom,
                defCollection: {
                    id: [],
                    def: undefined,
                },
                depsLocal: {},
                includedTemplates: {},
                viewController: this,
                context: isVdom ? context + 'part_' + templateCount++ : context,
                key: key + '0_',
                internal: {},
                mergeType: 'attribute',
            }
        );
    }
    if (!Array.isArray(valueToBuild)) {
        logError(
            'Узел в JsonML должен быть строкой или массивом',
            valueToBuild
        );
        return [];
    }
    wasResolved = valueAfterEmojisParse !== valueToBuild;
    resolverMode ^= wasResolved;
    const children = [];
    if (Array.isArray(valueToBuild[0])) {
        for (i = 0; i < valueToBuild.length; ++i) {
            children.push(
                recursiveMarkup(
                    attr,
                    data,
                    context,
                    isVdom,
                    valueToBuild[i],
                    attrsToDecorate,
                    key + i + '_',
                    valueToBuild,
                    options
                )
            );
        }
        resolverMode ^= wasResolved;
        return children;
    }
    let firstChildIndex = 1;
    const tagName = valueToBuild[0];
    const attrs = {
        attributes: {},
        events: {},
        key,
    };
    const validNodesValue = isKeyExist(currentValidHtml.validNodes, tagName);
    let additionalValidAttributes;
    if (!validNodesValue) {
        resolverMode ^= wasResolved;
        return [];
    }
    if (typeof validNodesValue === 'object') {
        additionalValidAttributes = validNodesValue;
    }
    if (
        valueToBuild[1] &&
        !isString(valueToBuild[1]) &&
        !Array.isArray(valueToBuild[1])
    ) {
        firstChildIndex = 2;
        validAttributesInsertion(
            attrs.attributes,
            valueToBuild[1],
            additionalValidAttributes
        );
    }
    for (i = firstChildIndex; i < valueToBuild.length; ++i) {
        children.push(
            recursiveMarkup(
                attr,
                data,
                context,
                isVdom,
                valueToBuild[i],
                {},
                key + i + '_',
                valueToBuild,
                options
            )
        );
    }
    resolverMode ^= wasResolved;
    return [
        markupGenerator.createTag(
            tagName,
            attrs,
            children,
            attrsToDecorate,
            defCollection,
            control,
            key
        ),
    ];
}

const template = function (
    data,
    attr,
    context,
    isVdom,
    sets,
    forceCompatible,
    generatorConfig
) {
    markupGenerator = thelpers.createGenerator(
        isVdom,
        forceCompatible,
        generatorConfig
    );
    defCollection = {
        id: [],
        def: undefined,
    };
    control = data;
    resolver = control._options.tagResolver;
    resolverParams = control._options.resolverParams || {};
    resolverMode = 1;
    currentValidHtml = control._options.validHtml || lowerValidHtml;

    const events = attr.events || {};
    if (constants.isBrowserPlatform) {
        addEventListener(events, 'on:contextmenu', '_contextMenuHandler');
        addEventListener(events, 'on:copy', '_copyHandler');
    }
    let elements = [],
        key = (attr && attr.key) || '_',
        attrsToDecorate = {
            // _isRootElement ничего не поменяет в инферно, но нужен в реакте.
            _isRootElement: attr._isRootElement,
            refForContainer: attr.refForContainer,
            attributes: attr.attributes,
            events,
            context: attr.context,
        },
        oldEscape,
        value = control._options.value;
    if (value && value.length) {
        // Need just one root node.

        // Mobile can't work with tags yet, so can be value like ["text"].
        // TODO: cancel this merge in https://online.sbis.ru/opendoc.html?guid=a8a904f8-6c0d-4754-9e02-d53da7d32c99
        if (Array.isArray(value) && value.length === 1 && isString(value[0])) {
            value = [
                'div',
                value[0].split('\n').map(function (str, index) {
                    // Newline symbol does not shown in the middle of tag.
                    return index ? ['p', '\n' + str] : ['p', str];
                }),
            ];
        } else {
            value = ['div', value];
        }
    }
    if (!isVdom) {
        // Markup Converter should escape long space characters too.
        oldEscape = markupGenerator.escape;
        markupGenerator.escape = function (str) {
            return oldEscape(str).replace(
                additionalNotVdomEscapeRegExp,
                (match) => (match[0] === '&' ? '&amp;#' : '&nbsp;')
            );
        };
    }
    try {
        elements = recursiveMarkup(
            attr,
            data,
            context,
            isVdom,
            value,
            attrsToDecorate,
            key + '0_',
            null,
            control._options
        );
    } catch (e) {
        Logger.error('UI/Executor:TClosure: ' + e.message, undefined, e);
    } finally {
        if (!isVdom) {
            markupGenerator.escape = oldEscape;
        }
    }

    if (!elements.length) {
        elements = [
            !control._isMarkupConverter
                ? markupGenerator.createTag(
                      'div',
                      { key: key + Date.now() + '_' },
                      [],
                      attrsToDecorate,
                      defCollection,
                      control,
                      key + '0_'
                  )
                : '',
        ];
    }

    // Избежим утечки из-за глобальных переменных.
    control = null;
    resolver = null;
    resolverParams = null;
    resolverMode = null;
    currentValidHtml = null;

    return markupGenerator.joinElements(elements, key, defCollection);
};

function parseEmojis(node) {
    let childrenIndex = 1;
    const ATTRIBUTES_INDEX = 1;

    const isAttrsCandidateString = isString(node[ATTRIBUTES_INDEX]);
    const isAttrsCandidateArray = Array.isArray(node[ATTRIBUTES_INDEX]);
    if (
        node[ATTRIBUTES_INDEX] &&
        !isAttrsCandidateString &&
        !isAttrsCandidateArray
    ) {
        childrenIndex = 2;
    }

    const newNode = object.clone(node);
    let isModelChanged = false;

    for (let i = childrenIndex; i < node.length; i++) {
        const isChildrenString = node[i] && isString(node[i]);
        const isClassString = isString(node[ATTRIBUTES_INDEX]?.class);
        const isEmojiNode =
            isClassString &&
            node[ATTRIBUTES_INDEX]?.class?.includes(EMOJI_CLASS_NAME);
        if (isChildrenString && !isEmojiNode) {
            newNode[i] = [];

            const processedText = node[i];
            const ZERO_WIDTH_REGEX = /\uFE0F/g;
            const EMPTY_STRING = '';
            let emojiParseExec;
            let index = 0;

            while (
                (emojiParseExec = EMOJI_REGEX.exec(processedText)) !== null
            ) {
                isModelChanged = true;
                const emoji = emojiParseExec[0];
                const emojiIndex = emojiParseExec.index;
                const text = processedText.slice(index, emojiIndex);
                if (text.length) {
                    newNode[i].push(['span', text]);
                }
                const emojiElement = [
                    'span',
                    { class: EMOJI_CLASS_NAME },
                    emoji,
                ];
                newNode[i].push(emojiElement);
                index = emojiIndex + emoji.length;
            }

            if (isModelChanged) {
                // если после последнего найденного смайлика остался текст, создаем еще один текстовый элемент
                let textAfterLastEmoji = processedText.slice(
                    index,
                    processedText.length
                );

                // В строке может быть символ нулевой ширины, который визуально не виден.
                // Если он единственный в тексте после эмодзи,
                // то нет смысла создавать под него отдельную текстовую ноду,
                // иначе на его место будет вставать курсор при навигации, что введет пользователя в заблуждение.
                textAfterLastEmoji = textAfterLastEmoji.replace(
                    ZERO_WIDTH_REGEX,
                    EMPTY_STRING
                );

                if (textAfterLastEmoji.length) {
                    newNode[i].push(['span', textAfterLastEmoji]);
                }
            }

            if (!newNode[i].length) {
                newNode[i] = node[i];
            }
        }
    }
    return isModelChanged ? newNode : node;
}

// Template functions should have true "stable" flag to send error on using, for example, some control instead it.
template.stable = true;

export = template;
