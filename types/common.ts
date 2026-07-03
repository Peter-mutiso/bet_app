export interface Pagination {

    page: number;

    limit: number;

    total: number;

}

export interface Timestamped {

    createdAt: string;

    updatedAt: string;

}

export type UUID = string;