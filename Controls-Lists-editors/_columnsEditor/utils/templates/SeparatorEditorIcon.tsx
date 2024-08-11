interface ICaptionTemplateProps {
    icon: string;
}

export function SeparatorEditorIcon(props: ICaptionTemplateProps): JSX.Element {
    return (
        <div
            className={`controls-icon controls-icon_size-s controls-icon_style-default ${props.icon}`}
        ></div>
    );
}
