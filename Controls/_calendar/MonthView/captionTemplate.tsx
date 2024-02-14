/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';

interface ICaptionTemplateProps {
    caption: string;
}

export default function CaptionTemplate(props: ICaptionTemplateProps): React.ReactElement {
    return <div className="controls-MonthViewVDOM__caption-text">{props.caption}</div>;
}
