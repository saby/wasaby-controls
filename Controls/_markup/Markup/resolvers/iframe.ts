import {JSONML, IJSONML} from 'Types/entity';

const IFRAME_CLASS_NAME = 'MarkupDecorator__iframe';

export default function parseIframe(node: IJSONML) {
    const isIframe = JSONML.getNodeName(node) === 'iframe';

    if (isIframe) {
        JSONML.removeAttribute(node, 'style');

        const className = (JSONML.getAttribute(node,'class') as string) ?? '';
        if (!className.includes(IFRAME_CLASS_NAME)) {
            JSONML.setAttribute(node, 'class', `${className} ${IFRAME_CLASS_NAME}`);
        }
    }

    return node;
}
