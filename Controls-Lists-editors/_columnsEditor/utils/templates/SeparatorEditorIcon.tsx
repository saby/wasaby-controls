/**
 * Интерфейс иконки редактора границ
 * @private
 */
interface ICaptionTemplateProps {
    /**
     * Иконка
     */
    icon: string;
}

/**
 * Иконка редактора границ
 * @param {ICaptionTemplateProps} props Пропсы компонента
 * @category component
 * @private
 */
export function SeparatorEditorIcon(props: ICaptionTemplateProps): JSX.Element {
    return (
        <div
            className={`controls-icon controls-icon_size-s controls-icon_style-default ${props.icon}`}
        ></div>
    );
}
