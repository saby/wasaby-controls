export interface IAccountant {
    jobName: string;
    experience: number;
    salary: number;
}

export type TSpeciality = 'programmer' | 'mechanic';

export interface IEngineer {
    jobName: string;
    experience: number;
    salary: string;
    speciality: TSpeciality;
    teamLeader: boolean;
}

export interface IPerson {
    name: string;
    surname: string;
    job: {
        engineer: IEngineer;
        accountant: IAccountant;
    };
    country: string;
}
