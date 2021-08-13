import { CChunkFinal , Details } from './CChunk';
import { CText } from './CText';
import { Font } from './interface'

export class CLeftBar extends CChunkFinal {
    private m_font: Font;
    private m_context: CanvasRenderingContext2D;
    private m_text: CText;

    constructor( size: [ number , number ] , offset: [ number , number ] , details: Details | undefined = undefined ) {
        super( size , offset , details );
        
        this.m_font = window.gFont;
        this.m_context = window.gContext;
        this.m_text = window.gBuffer;
    }

    public Draw() {
        const curCol = this.m_context.fillStyle;

        this.m_context.fillStyle = this.m_background;
        this.m_context.fillRect( this.m_offset[ 0 ] , this.m_offset[ 1 ] , this.m_size[ 0 ] , this.m_size[ 1 ] );
        
        for( let i = 1 ; i <= this.m_text.m_text.length ; i++ ) {
            this.m_context.fillStyle = this.m_color;
            const curAlign = this.m_context.textAlign;
            this.m_context.textAlign = "right";
            this.m_context.fillText( 
                `${ i }` , 
                this.m_offset[ 0 ] + this.m_size[ 0 ] - 3 , 
                this.m_offset[ 1 ] + i * this.m_font.size - 3 
            );
            this.m_context.textAlign = curAlign;
            
            this.m_context.fillStyle = "#F00";
            this.m_context.textAlign = "left";
            this.m_context.fillText( 
                `${ this.m_text.m_text[ i - 1 ].length }` , 
                this.m_offset[ 0 ] , 
                this.m_offset[ 1 ] + i * this.m_font.size - 3 
            );
        }

        this.m_context.fillStyle = curCol;
    }

    public Init() {
        this.m_font = window.gFont;
        this.m_context = window.gContext;
        this.m_text = window.gBuffer;
    }
}
