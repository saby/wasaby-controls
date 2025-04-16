import { forwardRef, LegacyRef, ReactElement } from 'react';
import IInnerTemplateProps from '../interfaces/IInnerTemplateProps';

export default forwardRef(function InnerTemplate(
    { value, caption, ...props }: IInnerTemplateProps,
    ref: LegacyRef<HTMLDivElement>
): ReactElement {
    const isSign = caption && caption.length === 1;
    return (
        <div
            className={
                'tw-relative tw-flex tw-flex-col tw-items-center controls-Graphs_RoundChart__innerTemplate_offset_' +
                (caption && props.topCaptionTemplate
                    ? 'with_top-caption'
                    : caption
                    ? isSign
                        ? 's'
                        : 'xs'
                    : '') +
                ` ${props.className}`
            }
            ref={ref}
            onClick={props.innerTemplateClickCallback}
            title={props.title}
        >
            {caption && props.topCaptionTemplate && (
                <div className="controls-fontsize-xs controls-Graphs_RoundChart__innerTemplate__additionCaption_height">
                    <props.topCaptionTemplate />
                </div>
            )}
            <div
                className={`tw-relative controls-fontsize-6xl controls-text-default${
                    caption && props.topCaptionTemplate
                        ? ' controls-Graphs_RoundChart__innerTemplate_value_withTopCaption'
                        : ''
                }`}
            >
                {value}
            </div>
            {caption && (
                <div
                    className={
                        'tw-relative controls-text-label' +
                        ' controls-Graphs_RoundChart__innerTemplate_caption_offset_' +
                        (caption && props.topCaptionTemplate
                            ? '3xs controls-Graphs_RoundChart__innerTemplate__additionCaption_height'
                            : isSign
                            ? '2xs'
                            : 'xs') +
                        ' controls-fontsize-' +
                        (isSign ? '3xl' : 'l')
                    }
                >
                    {caption}
                </div>
            )}
        </div>
    );
});
