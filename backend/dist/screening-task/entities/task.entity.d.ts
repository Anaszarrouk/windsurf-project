export declare enum TaskStatus {
    EN_ATTENTE = "En attente",
    EN_COURS = "En cours",
    FINALISE = "Finalis\u00E9"
}
export declare class Task {
    id: string;
    name: string;
    description: string;
    date: Date;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    version: number;
}
