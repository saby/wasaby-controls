import * as React from 'react';
import { TTagStyle } from 'Controls/interface';

export interface IProps {
    tagStyle?: TTagStyle;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    className?: string;
}

/**
 * Тэг в правом углу ячейки таймлайн таблицы.
 * Является заменой стандартному тегу-уголку
 * @param props
 * @constructor
 */
export default function TimelineTag(props: IProps) {
    const baseClass = `ControlsLists-timelineGrid__tag_light tw-cursor-help ControlsLists-timelineGrid__tag_light-style-${props.tagStyle}`;

    const className = props.className ? `${baseClass} ${props.className}` : baseClass;

    return (
        <div
            className={className}
            data-qa={'timeline-tag_light'}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
        />
    );
}
