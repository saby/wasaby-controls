import { TemplateFunction } from 'UICommon/Base';
import { MouseEvent, ReactNode } from 'react';

export default interface IInnerTemplateProps {
    value: string;
    caption: string;
    topCaptionTemplate?: TemplateFunction | ReactNode;
    className?: string;
    innerTemplateClickCallback?: (event: MouseEvent<HTMLDivElement>) => void;
    title?: string;
}
