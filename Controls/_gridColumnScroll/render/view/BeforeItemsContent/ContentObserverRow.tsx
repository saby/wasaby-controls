import { ContentObserverComponent } from 'Controls/columnScrollReact';
import useGridSeparatedRowStyles, {
    TUseGridSeparatedRowStylesProps,
} from './useGridSeparatedRowStyles';
import { QA_SELECTORS } from '../../../common/data-qa';

export interface IContentObserverRowProps extends Omit<TUseGridSeparatedRowStylesProps, 'part'> {}

export default function ContentObserverRow(props: IContentObserverRowProps): JSX.Element {
    const { startFixedCellStyle, scrollableCellStyle, endFixedCellStyle } =
        useGridSeparatedRowStyles(props);

    return (
        <div className="tw-contents" data-qa={QA_SELECTORS.CONTENT_OBSERVER}>
            <ContentObserverComponent
                startFixedDiv={startFixedCellStyle && <div style={startFixedCellStyle} />}
                scrollableDiv={<div style={scrollableCellStyle} />}
                endFixedDiv={endFixedCellStyle && <div style={endFixedCellStyle} />}
            />
        </div>
    );
}
