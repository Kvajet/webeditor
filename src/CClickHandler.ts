type AreaFunc = ( options: any ) => any;

export interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
    Action: AreaFunc;
}

export class CClickHandler {
    private m_areas: Area[] = [];

    constructor() {

    }

    public Register( item: Area ) {
        this.m_areas.push( item );
    }

    private Handler( ev: MouseEvent ) {
        console.log( ev );
    }
}
