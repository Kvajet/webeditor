import { CText } from './CText';
import { Font } from './interface';
import { CChunkAbstract , CChunkDual , CChunkEmpty , CChunkFinal, EOrientation , Details } from './CChunk';
import { CLeftBar } from './CLeftBar';
import { CTopBar } from './CTopBar';
import { CClickHandler } from './CClickHandler';
import settings from './settings'

declare global {
    interface Window {
        gCanvas: HTMLCanvasElement,
        gContext: CanvasRenderingContext2D,
        gFont: Font,
        gBuffer: CText
    }
}

// typescript is not able to import unused stuff therefore the eval() doesnt work
// kill me now
const dump = CLeftBar;

export class CTextEditor extends CChunkDual {
    private m_canvas: HTMLCanvasElement;
    private m_context: CanvasRenderingContext2D;
    private m_buffer: CText;
    private m_clickHandler: CClickHandler = new CClickHandler();

    private m_font: Font;

    constructor() {
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

        window.gBuffer = new CText( [ 0 , 0 ] , [ 0 , 0 ] );

        super([
                new CTopBar( [ 0 , 0 ] , [ 0 , 0 ] ) ,
                window.gBuffer
            ] , 
            [ window.innerWidth , window.innerHeight ] , 
            EOrientation.HORIZONTAL , 
            [ 20 , 80 ] ,
            [ 0 , 0 ]
        );

        this.m_canvas = canvas;
        this.m_context = context;
        this.m_font = window.gFont;
        this.m_buffer = window.gBuffer;

        this.SetCanvas();
        this.SetFont();

        // TODO, working now, should be better, edit: this is dogshit
        this.m_content = this.Construct( settings );
        this.m_content = this.m_content.m_content;
        const match = settings[ "ratio" ].match( /([0-9]+):([0-9]+)/ );
        this.m_ratio = [ Number( match[ 1 ] ) , Number( match[ 2 ] ) ];
        this.m_orientation = settings[ "orientation" ] === "horizontal" ? EOrientation.HORIZONTAL : EOrientation.VERICAL
        this.Rescale( [ this.m_canvas.width , this.m_canvas.height ] , [ 0 , 0 ] , this.m_ratio );

        this.m_buffer.Magic( settings );
    }

    private SetCanvas() {
        this.ResizeCanvas();
        window.addEventListener( 'resize' , this.ResizeCanvas.bind( this ) );
        document.addEventListener( 'keydown' , ev => {
            if( ev.key === "Control" ) {
                this.m_buffer.CtrlPress();
            }
            if( ev.key === "Tab" )
                ev.preventDefault();
            this.m_buffer.Process( ev.key );
        });
        document.addEventListener( 'keyup' , ev => {
            if( ev.key === "Control" ) {
                this.m_buffer.CtrlRelease();
            }
        });
    }

    private SetFont() {
        this.m_context.font = `${ this.m_font.size }px ${ this.m_font.fontname }`;
        this.m_font.calcWidth = this.m_context.measureText( "A" ).width;
    }

    private ResizeCanvas() {
        this.m_canvas.width = window.innerWidth;
        this.m_canvas.height = window.innerHeight;
        this.Rescale( [ this.m_canvas.width , this.m_canvas.height ] , [ 0 , 0 ] , this.m_ratio );
    }

    private Construct( settings: any ): CChunkAbstract {
        if( settings[ "type" ] === "final" ) {
            let ret: CChunkFinal;
            if( settings[ "name" ] === "CText" )
                ret = window.gBuffer;
            else
                ret = eval( `new ${ settings[ "name" ] }([50,50],[0, 0])` );
            
            ret.Options( settings[ "options" ] );
            return ret;
        } else {
            const match = settings[ "ratio" ].match( /([0-9]+):([0-9]+)/ );
            if( match == null ) 
                throw Error( "Invalid ration attribute." );
            return new CChunkDual(
                [ 
                    this.Construct( settings[ "first"  ] ) ,
                    this.Construct( settings[ "second" ] )
                ],
                [ 0 , 0 ],
                settings[ "orientation" ] === "horizontal" ? EOrientation.HORIZONTAL : EOrientation.VERICAL ,
                [ Number( match[ 1 ] ) , Number( match[ 2 ] ) ],
                [ 0 , 0 ]
            )
        }
    }

    public Draw() {
        ( this.m_content as [ CChunkAbstract , CChunkAbstract ] )[ 0 ].Draw();
        ( this.m_content as [ CChunkAbstract , CChunkAbstract ] )[ 1 ].Draw();
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
