export interface IAccountant {
    jobName: string;
    experience: number;
    salary?: string;
}

export type TSpeciality = 'programmer' | 'mechanic';

export interface IEngineer {
    jobName: string;
    experience: number;
    salary: string;
    speciality: TSpeciality;
    specialSkills: boolean;
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
