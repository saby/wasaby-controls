import { ICaptionProps } from 'Controls/_tileRender/interface/IRenderAspects';

export function Caption(props: ICaptionProps) {
    if (!props.caption) {
        return null;
    }

    return <div>caption</div>;
}
