import type { CSSProperties } from 'react';

function formatStringToCamelCase(str: string): string {
    const splitted = str.split('-');
    if (splitted.length === 1) return splitted[0];
    return (
        splitted[0] +
        splitted
            .slice(1)
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join('')
    );
}

export function getStyleObjectFromString(str: string): CSSProperties {
    const style: CSSProperties = {};
    str.split(';').forEach((el) => {
        const [property, value] = el.split(':');
        if (!property) return;

        const formattedProperty = formatStringToCamelCase(property.trim());
        style[formattedProperty] = value.trim();
    });

    return style;
}
