
export class Asana {
    id?: any;
    sanskritName?: string;
    about:string;
    author: string
    authorUID: any
    authorImageUrl:any
    englishName: string
    date: Date
    step: AsanaSteps
    steps: AsanaSteps[];
    anatomies:any;
    totalVotesCount?: number = 0;
}

export class AsanaSteps {
    step: string
    options: AsanaOption[];
}

export class AsanaOption {
    option: string = '';
    votesCount?: number = 0;
    votePercent?:any = '0%'
}

export class Asanas extends Asana {
  
}

// export const initPoll = {
//     poll: {
//         id: '',
//         days: '',
//         author: '',
//         authorUID: '',
//         city: '',
//         date: new Date(),
//         question: {}
//     }
// }