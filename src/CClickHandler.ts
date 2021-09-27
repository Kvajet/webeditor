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
        window.addEventListener( 'click' , this.Handler.bind( this ) );
    }

    public Register( item: Area ) {
        this.m_areas.push( item );
    }

    private Handler( ev: MouseEvent ) {
        // console.log( this.m_areas );
        console.log( this.Hit( ev ) );
    }

    private Hit( ev: MouseEvent ) {
        for( const area of this.m_areas ) {
            if(    area.x               <= ev.clientX 
                && area.x + area.width  >= ev.clientX
                && area.y               <= ev.clientY
                && area.y + area.height >= ev.clientY 
            ) {
                area.Action( null );
                return true;
            }
        }
        return false;
    }
}
