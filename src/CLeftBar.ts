import { CChunkFinal , Details } from './CChunk';
import { CRenderer } from './CRenderer';
import { CText } from './CText';
import { Font } from './interface'

export class CLeftBar extends CChunkFinal {
    private m_font: Font;
    private m_text: CText;
    private m_renderer: CRenderer;

    constructor( size: [ number , number ] , offset: [ number , number ] , details: Details | undefined = undefined ) {
        super( size , offset , details );
        
        this.m_font = window.coreComponents.font;
        this.m_text = window.gBuffer;
        this.m_renderer = window.coreComponents.renderer;
    }

    public Draw() {
        const curCol = this.m_renderer.GetTextColor();

        this.m_renderer.SetTextColor( this.m_background );
        this.m_renderer.RenderRect( this.m_offset , this.m_size );

        for( let i = 1 ; i <= this.m_text.m_text.length ; i++ ) {
            this.m_renderer.SetTextColor( this.m_color );

            this.m_renderer.SetTextColor( "#F00" );
            const length = `${ i }`;
            this.m_renderer.RenderText( 
                length , 
                [
                    this.m_offset[ 0 ] + this.m_size[ 0 ] - length.length * this.m_font.calcWidth ,
                    this.m_offset[ 1 ] + i * this.m_font.size - 3
                ]
            );
            
            this.m_renderer.SetTextColor( this.m_color );

            this.m_renderer.RenderText( 
                `${ this.m_text.m_text[ i - 1 ].length }` , 
                [ this.m_offset[ 0 ] , this.m_offset[ 1 ] + i * this.m_font.size - 3 ] 
            );
        }

        this.m_renderer.SetTextColor( curCol );
    }

    public Init() {
        this.m_font = window.coreComponents.font;
        this.m_text = window.gBuffer;
        this.m_renderer = window.coreComponents.renderer;
    }
}
