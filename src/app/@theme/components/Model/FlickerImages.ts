export interface FlickerResponse {

    title: string;
    link: string;
    description: string;
    modified: Date;
    generator: string;
    items: Item[];
}

export interface Item {
    title: string;
    link: string;
    media: MediaUrl;
    date_taken: Date;
    description: string;
    published: Date;
    author: string;
    author_id: string;
    tags: string;
}

export interface MediaUrl {
    m: string;
}