import dependencyTest from '../testEnv/dependencyTest';
import {
    ANY_DISPLAY_LIBS,
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    ANY_OLD_PUBLIC_COMPONENT_LIBS,
    ANY_RENDER_LIBS,
    LibPath,
    OMIT,
} from '../testEnv/constants';

describe(LibPath.NewExplorer, () => {
    dependencyTest(
        LibPath.NewExplorer,
        [],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,

            ...OMIT(ANY_NEW_PUBLIC_COMPONENT_LIBS, LibPath.NewExplorer),

            ...ANY_DISPLAY_LIBS,
            ...ANY_RENDER_LIBS,

            LibPath.ListWebReducers,
            LibPath.ListVisualAspects,
            LibPath.ListsCommonLogic,
        ]
    );
});
