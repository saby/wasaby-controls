import dependencyTest from '../testEnv/dependencyTest';
import {
    ANY_DISPLAY_LIBS,
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    ANY_OLD_PUBLIC_COMPONENT_LIBS,
    LibPath,
    OMIT,
} from '../testEnv/constants';

describe(LibPath.NewTreeGrid, () => {
    dependencyTest(
        LibPath.NewTreeGrid,
        [LibPath.ListsCommonLogic, LibPath.GridRender, LibPath.TreeGridRender],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,

            ...OMIT(ANY_NEW_PUBLIC_COMPONENT_LIBS, LibPath.NewTreeGrid),

            ...ANY_DISPLAY_LIBS,

            LibPath.GridReact,
            LibPath.ListWebReducers,
        ]
    );
});
