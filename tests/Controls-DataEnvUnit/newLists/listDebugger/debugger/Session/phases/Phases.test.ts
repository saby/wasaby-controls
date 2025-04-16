import {
    PhaseOne,
    PhaseTwo,
    PhaseThree,
    PhaseFour,
    PhaseFive,
    PhaseSix,
} from 'Controls-DataEnv/newLists/_listDebug/debugger/session/phases';

describe('Controls-DataEnv/newLists/_listDebug/debugger/session/phases/*', () => {
    it('Ожидаемый и уникальный идентификатор у каждой фазы', () => {
        expect([
            new PhaseOne().id,
            new PhaseTwo().id,
            new PhaseThree().id,
            new PhaseFour().id,
            new PhaseFive().id,
            new PhaseSix().id,
        ]).toEqual([
            'FirstPhase',
            'SecondPhase',
            'ThirdPhase',
            'FourthPhase',
            'FivePhase',
            'SixPhase',
        ]);
    });
});
