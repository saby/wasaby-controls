/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */

export function getRoundClass({ hasRoundedBorder, options, type }): string {
    if (hasRoundedBorder) {
        if (type === 'header') {
            if (!(options.bodyContentTemplate || options.footerContentTemplate)) {
                return `controls-PopupTemplate__roundBorder_bottom controls_border-radius-${
                    options.borderRadius || 's'
                }`;
            }
        } else if (type === 'body') {
            if (!(options.headingCaption || options.headerContentTemplate)) {
                if (options.footerContentTemplate) {
                    return `controls-PopupTemplate__roundBorder_top controls_border-radius-${
                        options.borderRadius || 's'
                    }`;
                } else {
                    return `controls-PopupTemplate__roundBorder controls_border-radius-${
                        options.borderRadius || 's'
                    }`;
                }
            } else {
                if (!options.footerContentTemplate) {
                    return `controls-PopupTemplate__roundBorder_bottom  controls_border-radius-${
                        options.borderRadius || 's'
                    }`;
                }
            }
        }
    }
}
