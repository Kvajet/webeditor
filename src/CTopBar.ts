import { CChunkFinal , Details } from './CChunk';
import { CText } from './CText';
import { Font } from './interface'

export class CTopBar extends CChunkFinal {
    private m_font: Font;
    private m_context: CanvasRenderingContext2D;
    private m_buffer: CText;

    constructor( size: [ number , number ] , offset: [ number , number ] , details: Details | undefined = undefined ) {
        super( size , offset , details );
        
        this.m_font = window.gFont;
        this.m_context = window.gContext;
        this.m_buffer = window.gBuffer;
    }

    public Draw() {
        const curCol = this.m_context.fillStyle;
        
        this.m_context.fillStyle = this.m_background;
        this.m_context.fillRect( this.m_offset[ 0 ] , this.m_offset[ 1 ] , this.m_size[ 0 ] , this.m_size[ 1 ] );

        this.m_context.fillStyle = this.m_color;
        this.m_context.fillText( 
            `[ ${ this.m_buffer.m_pos[ 0 ] } ; ${ this.m_buffer.m_pos[ 1 ] } ]` , 
            this.m_offset[ 0 ] , 
            this.m_offset[ 1 ] + this.m_font.size - 6 
        );

        this.m_context.fillStyle = curCol;
    }

    public Init() {
        this.m_font = window.gFont;
        this.m_context = window.gContext;
        this.m_buffer = window.gBuffer;
    }
}
