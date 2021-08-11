export interface Font {
    size: number;
    fontname: string;
    calcWidth: number;
    color: string;
}

export interface Cursor {
    width: number;
    height: number;
    color: string;
    Draw(): void;
}
