import dependencyTest from '../testEnv/dependencyTest';
import {
    ANY_OLD_PUBLIC_COMPONENT_LIBS,
    ANY_DISPLAY_LIBS,
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    LibPath,
    OMIT,
} from '../testEnv/constants';

describe(LibPath.NewGrid, () => {
    dependencyTest(
        LibPath.NewGrid,
        [LibPath.ListsCommonLogic, LibPath.GridRender],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,

            ...OMIT(ANY_NEW_PUBLIC_COMPONENT_LIBS, LibPath.NewGrid),

            ...ANY_DISPLAY_LIBS,

            LibPath.GridReact,
            LibPath.TreeGridRender,

            LibPath.ListVisualAspects,

            LibPath.ListWebReducers,
        ]
    );
});
