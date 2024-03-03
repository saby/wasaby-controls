import {JSONML} from 'Types/entity';

const SANDBOX_ATTRIBUTE_NANE = 'sandbox';

export default function parseIframe(node) {
    const isIframe = JSONML.getNodeName(node) === 'iframe';

    if (isIframe && !Boolean(JSONML.getAttribute(node, SANDBOX_ATTRIBUTE_NANE))) {
        JSONML.setAttribute(node, SANDBOX_ATTRIBUTE_NANE, 'allow-same-origin allow-popups');
    }

    return node;
}
