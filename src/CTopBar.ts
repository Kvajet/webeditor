import { CChunkFinal , Details } from './CChunk';
import { CRenderer } from './CRenderer';
import { CText } from './CText';
import { Font } from './interface'

export class CTopBar extends CChunkFinal {
    private m_font: Font;
    private m_buffer: CText;
    private m_renderer: CRenderer;

    constructor( size: [ number , number ] , offset: [ number , number ] , details: Details | undefined = undefined ) {
        super( size , offset , details );
        
        this.m_font = window.coreComponents.font;
        this.m_buffer = window.gBuffer;
        this.m_renderer = window.coreComponents.renderer;
    }

    public Draw() {
        const curCol = this.m_renderer.GetTextColor();

        this.m_renderer.SetTextColor( this.m_background );
        this.m_renderer.RenderRect( this.m_offset , this.m_size );

        this.m_renderer.SetTextColor( this.m_color );
        this.m_renderer.RenderText(
            `[ ${ this.m_buffer.m_pos[ 0 ] } ; ${ this.m_buffer.m_pos[ 1 ] } ]`,
            [ this.m_offset[ 0 ] , this.m_offset[ 1 ] + this.m_font.size - 6 ]
        )

        this.m_renderer.SetTextColor( curCol );

        // TMP BELOW
        this.m_renderer.SetTextColor( "white" );
        const filename = this.m_buffer.m_storage[ this.m_buffer.m_storagePos ].name;
        const coords: [ number , number ] = [
            ( this.m_size[ 0 ] - filename.length * this.m_font.calcWidth ) / 2 ,
            this.m_font.size - 4
        ];
        this.m_renderer.RenderText( filename , coords );

        const col = this.m_renderer.GetTextColor();
        this.m_renderer.SetTextColor( 'orange' );
        const radius = 8;
        for( let i = 0 ; i < this.m_buffer.m_storage.length ; i++ ) {
            this.m_renderer.SetTextColor( i === this.m_buffer.m_storagePos ? "lime" : "gray" );
            this.m_renderer.RenderCircle( 
                radius ,
                [ 
                    this.m_size[ 0 ] - radius * 2 - radius * 2.5 * i - 10,
                    ( this.m_size[ 1 ] - radius * 2 ) / 2
                ] 
            );    
        }

        this.m_renderer.SetTextColor( col );
    }

    public Init() {
        this.m_font = window.coreComponents.font;
        this.m_buffer = window.gBuffer;
        this.m_renderer = window.coreComponents.renderer;
    }
}
