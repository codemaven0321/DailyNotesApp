export interface NoteData {
    id: string;
    title: string;
    content: string;
    audioUrl?: string;
}

export const mockData: NoteData[] = [
    {
        id: "1",
        title: "First Title",
        content: "This is First Content",
        audioUrl: "/audio/DH-JongIlJin-2025-01-09 13-02-05.mp3",
    },
    {
        id: "2",
        title: "Second Title",
        content: "This is Second Content",
    },
    {
        id: "3",
        title: "Third Title",
        content: "This is Third Content",
    },
    {
        id: "4",
        title: "Fourth Title",
        content: "This is Fourth Content",
    },
    {
        id: "5",
        title: "Fifth Title",
        content: "This is Fifth Content",
    },
];
