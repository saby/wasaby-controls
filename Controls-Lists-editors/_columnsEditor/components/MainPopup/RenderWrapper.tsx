import { TransparentDataContextProvider } from 'Frame/player';
import { IRenderWrapperProps } from 'Controls-Lists-editors/_columnsEditor/interface';
import Render from 'Controls-Lists-editors/_columnsEditor/components/MainPopup/Render';

/**
 * Компонент - обертка над шаблоном окна диалога редактора колонок
 * @param props {IRenderWrapperProps}
 * @category component
 * @private
 */
function RenderWrapper(props: IRenderWrapperProps) {
    return (
        <TransparentDataContextProvider
            contextConfig={props.contextConfig}
            contextData={props.contextData}
        >
            <Render />
        </TransparentDataContextProvider>
    );
}

RenderWrapper.isReact = true;
export default RenderWrapper;
