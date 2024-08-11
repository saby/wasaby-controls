import { memo, useMemo } from 'react';
import { ITextStyle } from '../interface';

interface ITextStylePreviewProps {
    style: ITextStyle;
    value: string;
}

export const TextStylePreview = memo(({ style, value }: ITextStylePreviewProps): JSX.Element => {
    const text = useMemo(() => {
        return value.split('\n').map((str) => <p>{str}</p>);
    }, [value]);

    return <div style={style}>{text}</div>;
});
