import { memo, useMemo } from 'react';
import { ITextStyle } from '../interface';

interface ITextStylePreviewProps {
    style: ITextStyle;
    value: string;
}

export const TextStylePreview = memo(({ style, value }: ITextStylePreviewProps): JSX.Element => {
    const text = useMemo(() => {
        let key = 0;
        return value.split('\n').map((str) => <p key={key++}>{str}</p>);
    }, [value]);

    return <div style={style}>{text}</div>;
});
