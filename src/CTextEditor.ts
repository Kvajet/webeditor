import { CText } from './CText';
import { Font } from './interface';
import { CChunkAbstract , CChunkDual , CChunkFinal, EOrientation } from './CChunk';
import { CClickHandler } from './CClickHandler';
import { CControl } from './CControl';

declare global {
    interface Window {
        gCanvas: HTMLCanvasElement,
        gContext: CanvasRenderingContext2D,
        gFont: Font,
        gBuffer: CText,
        gControl: CControl
    }
}

export class CTextEditor extends CChunkDual {
    private m_canvas: HTMLCanvasElement;
    private m_context: CanvasRenderingContext2D;
    private m_buffer: CText;
    private m_clickHandler: CClickHandler = new CClickHandler();
    private m_control: CControl;

    private m_font: Font;

    constructor( chunk: CChunkDual ) {
        super(  < CChunkFinal | CChunkDual > chunk.m_content , 
            [ 
               window.innerWidth , 
               window.innerHeight 
            ] , 
            chunk.m_orientation , 
            chunk.m_ratio , 
            [ 0 , 0 ] 
        );

        // init canvas
        let canvas = document.getElementById( 'editor' ) as HTMLCanvasElement;
        if( canvas == null )
            throw Error( "Unable to find canvas." );
        window.gCanvas = canvas;

        // init context
        let context = canvas.getContext( '2d' );
        if( context == null )
            throw Error( "Unable to initialize context." );
        window.gContext = context;

        // init font
        window.gFont = {
            size: 24,
            fontname: "Consolas",
            calcWidth: 0,
            color: "#000"        
        };

        window.gControl = new CControl();

        this.m_canvas = canvas;
        this.m_context = context;
        this.m_font = window.gFont;
        this.m_control = window.gControl;
        this.m_buffer = window.gBuffer;

        this.SetCanvas();
        this.SetFont();
        this.Init();
    }

    private SetCanvas() {
        this.ResizeCanvas();
        window.addEventListener( 'resize' , this.ResizeCanvas.bind( this ) );
        this.m_control.AddKeyDown( this.m_buffer.Process.bind( this.m_buffer ) );
    }

    private SetFont() {
        this.m_context.font = `${ this.m_font.size }px ${ this.m_font.fontname }`;
        this.m_font.calcWidth = this.m_context.measureText( "A" ).width;
    }

    private ResizeCanvas() {
        this.m_canvas.width = window.innerWidth;
        this.m_canvas.height = window.innerHeight;
        this.SetFont();
        this.Rescale( [ this.m_canvas.width , this.m_canvas.height ] , [ 0 , 0 ] , this.m_ratio );
    }

    static async Construct( settings: any ): Promise< any > {
        if( settings[ "type" ] === "final" ) {
            return import( `./${ settings[ "name" ] }.ts` )
            .then( data => {
                const item = new data[ settings[ "name" ] ]( [ 50 , 50 ] , [ 0 , 0 ] );
                item.Options( settings[ "options" ] );

                if( settings[ "name" ] === "CText" )
                    window.gBuffer = item;

                return item;
            });
        } else {
            return new CChunkDual(
                [ 
                    await this.Construct( settings[ "first"  ] ) ,
                    await this.Construct( settings[ "second" ] )
                ],
                [ 0 , 0 ],
                settings[ "orientation" ] === "horizontal" ? EOrientation.HORIZONTAL : EOrientation.VERICAL ,
                CChunkAbstract.GetRatio( settings[ "ratio" ] ),
                [ 0 , 0 ]
            )
        }
    }

    private Loop = ( time: number ) => {
        this.m_context.clearRect( 0 , 0 , this.m_canvas.width , this.m_canvas.height );

        this.Draw();

        requestAnimationFrame( this.Loop );
    }

    public Process() {
        requestAnimationFrame( this.Loop );
    }
};
