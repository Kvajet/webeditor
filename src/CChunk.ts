export enum EOrientation {
    HORIZONTAL,
    VERICAL
};

export interface Details {
    color: string | undefined;
    background: string | undefined;
}

export class CChunkAbstract {
    public m_content: [ CChunkAbstract , CChunkAbstract ] | CChunkAbstract | null;
    public m_size: [ number , number ];
    public m_offset: [ number , number ];

    constructor( 
        content: [ CChunkAbstract , CChunkAbstract ] | CChunkAbstract | null , 
        size: [ number , number ] , 
        offset: [ number , number ]
    ) {
        this.m_content = content;
        this.m_size = size;
        this.m_offset = offset;
    }

    public Rescale( size: [ number , number ] , offset: [ number , number ] , ratio: undefined | [ number , number ] = undefined ) {
        this.m_size = size;
        this.m_offset = offset;
    }

    public SwitchOrientation() {
        // NONE
    }

    public Draw() {

    }

    public Options( options: any ) {

    }
};

export class CChunkFinal extends CChunkAbstract {
    public m_color: string = "#FFF";
    public m_background: string = "#000";

    constructor( size: [ number , number ] , offset: [ number , number ] , details: Details | undefined = undefined ) {
        super( null , size , offset );
        this.m_size = size;
        if( details ) {
            if( details.color ) this.m_color = details.color;
            if( details.background ) this.m_background = details.background;
        }
    }

    public Options( options: any ) {
        if( options == null )
            return;

        if( options.color ) this.m_color = options.color;
        if( options.background ) this.m_background = options.background;
    }

    public Click( coords: [ number , number ] ) {
        console.log( coords );
    }
}

export class CChunkDual extends CChunkAbstract {

    public m_orientation: EOrientation;
    public m_ratio: [ number , number ];

    constructor( 
            content: [ CChunkAbstract , CChunkAbstract ] | CChunkAbstract , 
            size: [ number , number ] , 
            orientation: EOrientation ,
            ratio: [ number , number ] ,
            offset: [ number , number ]
        ) {
        super( content , size , offset );

        this.m_orientation = orientation;
        this.m_ratio = ratio;
    }

    public SwitchOrientation() {
        this.m_orientation = this.m_orientation === EOrientation.HORIZONTAL ? EOrientation.VERICAL : EOrientation.HORIZONTAL;
    }

    // vertial | , horizontal -
    // changes size of this element, changes ratio and rescales descendants
    public Rescale( size: [ number , number ] , offset: [ number , number ] , ratio: [ number , number ] ) {
        this.m_size = size;
        if( ratio != null ) {
            this.m_ratio = ratio;
        }

        this.m_offset = offset;

        let sum = this.m_ratio[ 0 ] + this.m_ratio[ 1 ];
        let first: [ number , number ];
        let second: [ number , number ];
        let sOffset: [ number, number ];

        if( this.m_orientation === EOrientation.HORIZONTAL ) {
            first   = [ this.m_size[ 0 ]   , ( this.m_size[ 1 ] / sum ) * this.m_ratio[ 0 ] ];
            second  = [ this.m_size[ 0 ]   , ( this.m_size[ 1 ] / sum ) * this.m_ratio[ 1 ] ];
            sOffset = [ this.m_offset[ 0 ] , this.m_offset[ 1 ] + first[ 1 ] ];
        } else {
            first =   [ ( this.m_size[ 0 ] / sum ) *  this.m_ratio[ 0 ] , this.m_size[ 1 ] ];
            second =  [ ( this.m_size[ 0 ] / sum ) *  this.m_ratio[ 1 ] , this.m_size[ 1 ] ];
            sOffset = [ this.m_offset[ 0 ] + first[ 0 ]                 , this.m_offset[ 1 ] ];
        }
        ( this.m_content as [ CChunkAbstract , CChunkAbstract ] )[ 0 ].Rescale( first , this.m_offset );
        ( this.m_content as [ CChunkAbstract , CChunkAbstract ] )[ 1 ].Rescale( second , sOffset );
    }

    public Draw() {
        ( this.m_content as [ CChunkAbstract , CChunkAbstract ] )[ 0 ].Draw();
        ( this.m_content as [ CChunkAbstract , CChunkAbstract ] )[ 1 ].Draw();
    }
}

// this class is not recommended to use, using it is probably result of bad design,
// but I know myself, bad design is my best skill
export class CChunkEmpty extends CChunkAbstract {

    // Rescale is derived from CChunkAbstract, doing nothing
}
