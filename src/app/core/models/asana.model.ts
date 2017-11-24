
export class Asana {
    id?: any;
    days?: string
    author: string
    authorUID: any
    authorImageUrl:any
    city: object
    date: Date
    question: AsanaSteps
    questions: AsanaSteps[]
    totalVotesCount?: number = 0;
}

export class AsanaSteps {
    question: string
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