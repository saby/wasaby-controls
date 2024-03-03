import { forwardRef, LegacyRef, MouseEvent, ReactElement, SyntheticEvent } from 'react';
import PlaceholderWrapper from 'Controls/_input/Base/PlaceholderWrapper';
import { useTheme } from 'UI/Contexts';

interface IReadOnlyProps {
    className?: string;
    horizontalPadding?: string;
    value?: string;
    placeholderVisibility?: string;
    placeholderTemplate?: ReactElement;
    controlName?: string;
    onClick?: (e: SyntheticEvent<HTMLElement, MouseEvent>) => void;
    onMouseDown?: (e: SyntheticEvent<HTMLElement, MouseEvent>) => void;
}

export default forwardRef(function ReadOnly(props: IReadOnlyProps, ref: LegacyRef<HTMLDivElement>) {
    const { horizontalPadding, value, placeholderTemplate, placeholderVisibility, controlName } =
        props;

    const theme = useTheme(props);
    return placeholderVisibility === 'editable' || value ? (
        <div
            ref={ref}
            name="readOnlyField"
            className={`controls-InputBase__field_readOnly controls-${controlName}__field_margin-${horizontalPadding}${
                horizontalPadding === 'null'
                    ? ' controls-' + controlName + '__stretcher-block_margin-' + horizontalPadding
                    : ''
            }${props.className ? ` ${props.className}` : ''}`}
            data-qa={props['data-qa']}
            onMouseDown={props.onMouseDown}
            onClick={props.onClick}
        >
            {value}
        </div>
    ) : (
        <div
            ref={ref}
            className={`controls-InputBase__placeholder_readOnly controls-${controlName}__field_margin-${horizontalPadding}${
                horizontalPadding === 'null'
                    ? ' controls-' + controlName + '__stretcher-block_margin-' + horizontalPadding
                    : ''
            } controls-${controlName}__field_theme_${theme}_margin-${horizontalPadding}${
                props.className ? ` ${props.className}` : ''
            }`}
            data-qa={props['data-qa']}
            onMouseDown={props.onMouseDown}
        >
            <PlaceholderWrapper
                className="controls-InputBase__placeholder_readOnly"
                placeholderTemplate={placeholderTemplate}
                value={value}
                placeholderVisibility={placeholderVisibility}
            />
        </div>
    );
});
