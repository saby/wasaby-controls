import dependencyTest from './testEnv/dependencyTest';
import {
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    ANY_OLD_PUBLIC_COMPONENT_LIBS,
    ANY_DISPLAY_LIBS,
    LibPath,
    OMIT,
} from './testEnv/constants';

describe(LibPath.GridRender, () => {
    dependencyTest(
        LibPath.GridRender,
        [LibPath.ListsCommonLogic],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,
            ...ANY_NEW_PUBLIC_COMPONENT_LIBS,
            ...ANY_DISPLAY_LIBS,

            LibPath.ListVisualAspects,

            LibPath.GridReact,
            LibPath.TreeGridRender,

            LibPath.ListWebReducers,
        ]
    );
});
