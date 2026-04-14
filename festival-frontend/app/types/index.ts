export interface Prize{
    title:string;
    description:string;
}

export interface Venue {
    name:string;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  songTitle: string;
  performanceGenre: string;
  tour1Score: number;
  tour2Score: number;
  tour3Score: number;
  photoBase64?:string;
  allocatedSemiFinal:number;
  prize?:Prize | null;
  venue?: Venue | null;
  country?:string;
  performanceOrder?:number;
}

export interface JuryMember {
  id: string
  fullName: string
  qualification: string
  photoBase64?: string
}

export interface FinalResult {
  id: string;
  firstName: string;
  lastName: string;
  performanceGenre: string;
  tour3Score: number; 
  publicVotes: number;
  finalScore: number; 
  photoBase64:string;
}

export interface HostForm {
  fullname: string;
  role: string;
}

export interface TaskForm {
  title: string;
  description: string;
}