import { forwardRef, useState } from 'react';
import { View } from 'Controls/spoiler';

export default forwardRef(function CaptionPosition(_, ref) {
    const [expandedLeft, setExpandedLeft] = useState<boolean>(true);
    const [expandedEdgeLeft, setExpandedEdgeLeft] = useState<boolean>(true);
    const [expandedRight, setExpandedRight] = useState<boolean>(true);
    const captions: string = 'Заголовок';

    return <div
        className="controlsDemo__wrapper"
        ref={ref}>
        <div className="controlsDemo__cell">
            <div className="controls-text-label">captionPosition=right</div>
            <View
                captions={captions}
                expanded={expandedRight}
                onExpandedChanged={(_, value) => {
                    setExpandedRight(value);
                }}
                captionPosition="right">
                <div>Контентная область</div>
            </View>
        </div>
        <div className="controlsDemo__cell">
            <div className="controls-text-label">captionPosition=left</div>
            <View
                captions={captions}
                expanded={expandedLeft}
                onExpandedChanged={(_, value) => {
                    setExpandedLeft(value);
                }}
                captionPosition="left">
                <div>Контентная область</div>
            </View>
        </div>
        <div className="controlsDemo__cell controlsDemo__maxWidth200">
            <div className="controls-text-label">captionPosition=edgeLeft</div>
            <View
                captions={captions}
                expanded={expandedEdgeLeft}
                onExpandedChanged={(_, value) => {
                    setExpandedEdgeLeft(value);
                }}
                captionPosition="edgeLeft">
                <div>Контентная область</div>
            </View>
        </div>
    </div>;
});