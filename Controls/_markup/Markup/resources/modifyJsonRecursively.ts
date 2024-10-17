import { IJSONML, JSONML } from 'Types/entity';

/**
 * Рекурсивно изменяет json элементы.
 * @param {IJSONML} json Значение json.
 * @param {Function} tagResolver Преобразователь json узла, применяется к каждому узлу. Подробнее читайте {@link /doc/platform/developmentapl/service-development/service-contract/logic/json-markup-language/markup/#_1 в статье}.
 * @param {object} resolverParams Параметры для tagResolver.
 * @return {IJSONML}
 */
const modifyJsonRecursively = (
    json: IJSONML,
    tagResolver: Function,
    resolverParams?: object
): IJSONML => {
    JSONML.iterateJSONML(json, (value: IJSONML, parent: IJSONML) => {
        if (!parent) {
            const resultValue = tagResolver(value, parent, resolverParams);
            JSONML.replaceNode(resultValue, value);
        }

        if (!JSONML.hasChildNodes(value)) {
            return;
        }

        const children = JSONML.getChildren(value) as IJSONML[];
        const resultChildren = children.map((child) => tagResolver(child, value, resolverParams));
        JSONML.removeChildNodes(value);
        JSONML.append(value, ...resultChildren);
    });

    return json;
};

export default modifyJsonRecursively;
