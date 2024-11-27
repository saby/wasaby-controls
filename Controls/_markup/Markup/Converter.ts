/**
 * @kaizen_zone 87f8c36a-e8b9-4a3c-9554-83bbc997482a
 */
import template = require('./resources/template');
import linkDecorateUtils = require('./resources/linkDecorateUtils');
import objectMerge = require('Core/core-merge');
import { constants, IoC } from 'Env/Env';
import { getGeneratorConfig } from 'UI/Base';
import { setDisableCompatForMarkupDecorator } from 'UICommon/Executor';

const hasAnyTagRegExp: RegExp = /<[a-zA-Z]+.*?>/;
/**
 * Преобразователь типов из JsonML в HTML и обратно с возможностью клонирования JsonML массива.
 *
 * @class Controls/_markup/Markup/Converter
 * @public
 */

// Convert node to jsonML array.
function nodeToJson(node: Node) {
    // Text node, in jsonML it is just a string.
    if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue;
    }

    // Element node, in jsonML it is an array.
    if (node.nodeType === Node.ELEMENT_NODE) {
        let json = [];

        // json[0] is a tag name.
        const tagName = node.nodeName.toLowerCase();
        json[0] = tagName;

        // If node has attributes, they are located in json[1].
        const nodeAttributes = node.attributes;
        if (nodeAttributes.length) {
            const jsonAttributes = {};
            for (let i = 0; i < nodeAttributes.length; ++i) {
                jsonAttributes[nodeAttributes[i].name] = nodeAttributes[i].value;
            }
            json[1] = jsonAttributes;
        }

        // After that convert child nodes and push them to array.
        let firstChild;
        if (node.hasChildNodes()) {
            const childNodes = node.childNodes;
            let child;

            // Recursive converting of children.
            for (let i = 0; i < childNodes.length; ++i) {
                child = nodeToJson(childNodes[i]);
                if (!i) {
                    firstChild = child;
                }
                json.push(child);
            }
        }

        // By agreement, json shouldn't contain decorated link. Undecorate it if found.
        if (linkDecorateUtils.isDecoratedLink(tagName, firstChild)) {
            json = linkDecorateUtils.getUndecoratedLink(firstChild);
        }

        return json;
    }

    // Return empty array if node is neither text nor element.
    return [];
}

/**
 * Преобразует html-строки в допустимый JsonML. Используется только на стороне клиента.
 * @name Controls/_markup/Markup/Converter#htmlToJson
 * @function
 * @param {String} html
 * @returns {Array}
 */

/*
 * Convert html string to valid JsonML. Is using on client-side only.
 * @function Controls/_decorator/Markup/Converter#htmlToJson
 * @param {String} html
 * @returns {Array}
 */
const htmlToJson = (html) => {
    if (!constants.isBrowserPlatform) {
        IoC.resolve('ILogger').error(
            'Controls/_decorator/Markup/Converter',
            "htmlToJson method doesn't work on server-side"
        );
        return [];
    }

    if (html.trim() && !hasAnyTagRegExp.test(html)) {
        // Пришла строка без тега, значит, это текст, а не HTML.
        // TODO: во время рефактора написать функцию textToJson, и писать в консоль ошибку, если текст пришёл в
        // htmlToJson, а не в textToJson. https://online.sbis.ru/opendoc.html?guid=0ae06fe3-d773-4094-be9c-c365f4329d39
        return [[], html];
    }

    let div = document.createElement('div');
    let rootNodeTagName;
    let rootNodeAttributes;
    div.innerHTML = html.trim();
    const hasRootTag = div.innerHTML[0] === '<';
    const result = nodeToJson(div).slice(1);
    if (!hasRootTag && div.innerHTML) {
        // In this case, array will begin with a string that is not tag name, what is incorrect.
        // Empty json in the beginning will fix it.
        result.unshift([]);
    }
    div = null;

    // Add version.
    const rootNode = result[0];
    if (hasRootTag) {
        // TODO: replace this "magic" getting of attributes with a function from result of task to wrap JsonML.
        // https://online.sbis.ru/opendoc.html?guid=475ea157-8996-47e8-9842-6d4e6533bba5
        if (typeof rootNode[1] === 'object' && !Array.isArray(rootNode[1])) {
            rootNodeAttributes = rootNode[1];
        } else {
            rootNodeAttributes = {};
            rootNodeTagName = rootNode.shift();
            rootNode.unshift(rootNodeAttributes);
            rootNode.unshift(rootNodeTagName);
        }
        rootNodeAttributes.version = '2';
    }

    return result;
};

/**
 * Преобразует json-строки в строки формата html.
 * @name Controls/_markup/Markup/Converter#jsonToHtml
 * @function
 * @param {Array} json Json на основе JsonML.
 * @param {Function} tagResolver точно как в {@link Controls/_markup/Decorator#tagResolver}.
 * @param {Object} resolverParams точно как в {@link Controls/_markup/Decorator#resolverParams}.
 * @returns {String}
 */

/*
 * Convert Json to html string.
 * @function Controls/_decorator/Markup/Converter#jsonToHtml
 * @param {Array} json Json based on JsonML.
 * @param {Function} tagResolver exactly like in {@link Controls/_decorator/Markup#tagResolver}.
 * @param {Object} resolverParams exactly like in {@link Controls/_decorator/Markup#resolverParams}.
 * @returns {String}
 */
const jsonToHtml = (json, tagResolver?, resolverParams?) => {
    let result;
    try {
        // Вычисление шаблона должно производиться без слоя совместимости
        // https://online.sbis.ru/opendoc.html?guid=9108459a-bd21-48cb-8c1a-1d847e29f33a
        setDisableCompatForMarkupDecorator(true);

        const generatorConfig = getGeneratorConfig();
        result = template(
            {
                _options: {
                    value: json,
                    tagResolver,
                    resolverParams,
                },
                _isMarkupConverter: true,
                _moduleName: 'Controls/markup:Converter',
            },
            {},
            {},
            false,
            undefined,
            false,
            generatorConfig
        );

        setDisableCompatForMarkupDecorator(false);
    } catch (error) {
        IoC.resolve('ILogger').error('Controls/_decorator/Markup/Converter', error.message);
    } finally {
        setDisableCompatForMarkupDecorator(false);
    }

    return result;
};

/**
 * Преобразует json-массив в его копию по значению во всех узлах.
 * @name Controls/_markup/Markup/Converter#deepCopyJson
 * @function
 * @param {Array} json
 * @return {Array}
 */

/*
 * Convert Json array to its copy  by value in all nodes.
 * @function Controls/_decorator/Markup/Converter#deepCopyJson
 * @param json
 * @return {Array}
 */
const deepCopyJson = (json) => {
    return objectMerge([], json, { clone: true });
};

const MarkupConverter = {
    htmlToJson,
    jsonToHtml,
    deepCopyJson,
};

export = MarkupConverter;
