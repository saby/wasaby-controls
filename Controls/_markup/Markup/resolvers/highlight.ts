/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
// Find all indexes if search value in string.
function allIndexesOf(str: string, searchValue: string): number[] {
    let i = str.indexOf(searchValue);
    const result = [];
    while (i !== -1) {
        result.push(i);
        i += searchValue.length;
        i = str.indexOf(searchValue, i);
    }
    return result;
}

/**
 *
 * Модуль с функцией подсветки искомой строки.
 *
 * @class Controls/_markup/Markup/resolvers/highlight
 * @private
 * @remark
 * <pre class="brush: js">
 * // JavaScript
 * define("MyControl", ["UI/Base",  "wml!Template", "Controls/markup"], function(Base, template, decorator) {
 *    class MyControl extends Control<IControlOptions> {
 *       _template: template,
 *       json: [["p", "моя строка"]],
 *       tagResolver: decorator._highlightResolver,
 *       resolverParams: { "textToHighlight": "моя" }
 *    }
 *    return ModuleClass;
 * });
 * </pre>
 *
 * <pre class="brush: wml">
 * <Controls.markup:Decorator
 *     value="{{ json }}"
 *     tagResolver="{{ tagResolver }}"
 *     resolverParams="{{ resolverParams }}" />
 * </pre>
 *
 * В результате выполнения кода слово "моя" будет подсвечено.
 *
 */

/*
 *
 * Module with a function to highlight searched string.
 * Takes textToHighlight from {@link Controls/markup:Decorator#resolverParams}.
 * Tag resolver for {@link Controls/markup:Decorator}.
 *
 * @class Controls/_decorator/Markup/resolvers/highlight
 * @public
 * @author Угриновский Н.В.
 */
export default function highlight(
    value: string,
    parent: unknown,
    resolverParams: object
) {
    // Resolve only strings and only if text to highlight exists and not empty.
    if (
        (typeof value !== 'string' && !(value instanceof String)) ||
        !resolverParams.textToHighlight
    ) {
        return value;
    }

    const textToHighlight = resolverParams.textToHighlight;
    const allIndexesOfTextToHighlight = allIndexesOf(
        value.toLowerCase(),
        textToHighlight.toLowerCase()
    );

    // Text to highlight not found.
    if (!allIndexesOfTextToHighlight.length) {
        return value;
    }

    const newValue = [[]];
    let j = 0;
    let substringNotToHighlight;
    let substringToHighlight;

    for (let i = 0; i < allIndexesOfTextToHighlight.length; ++i) {
        substringNotToHighlight = value.substring(
            j,
            allIndexesOfTextToHighlight[i]
        );
        j = allIndexesOfTextToHighlight[i] + textToHighlight.length;
        substringToHighlight = value.substr(
            allIndexesOfTextToHighlight[i],
            textToHighlight.length
        );
        if (substringNotToHighlight) {
            newValue.push(substringNotToHighlight);
        }
        newValue.push([
            'span',
            { class: 'controls-MarkupDecorator_highlight' },
            substringToHighlight,
        ]);
    }
    substringNotToHighlight = value.substring(j);
    if (substringNotToHighlight) {
        newValue.push(substringNotToHighlight);
    }

    return newValue;
}
