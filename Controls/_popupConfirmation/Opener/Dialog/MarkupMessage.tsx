import { useCallback } from 'react';
import { lazy, importer } from 'UI/Async';
import { loadSync } from 'WasabyLoader/ModulesLoader';

const Markup = lazy(() => importer('Controls/markup:Decorator'));

interface IMarkupMessageProps {
    content: string;
}

export default function MarkupMessage(props: IMarkupMessageProps) {
    const value = '<span>' + props.content + '</span>';
    const tagResolver = useCallback(
        (json) => {
            if (json !== value) {
                return json;
            }
            // tagResolver вызывается изнутри Controls/markup:Decorator, так что в этой точке Converter всегда загружен.
            const { htmlToJson } = loadSync<{ htmlToJson: Function }>('Controls/markup:Converter');
            return htmlToJson(value);
        },
        [value]
    );
    return <Markup value={value} tagResolver={tagResolver} />;
}
