import { CText } from './CText';
import { Font } from './interface';
import { CChunkDual , CChunkFinal, } from './CChunk';
import { CClickHandler } from './CClickHandler';
import { CControl } from './CControl';
import { CRenderer, CRendererCanvas2D } from './CRenderer';

declare global {
    interface Window {
        // core components provided all the time
        coreComponents: {
            control: CControl,
            renderer: CRenderer,
            font: Font,
            settings: any
        }
        gBuffer: CText
    }
}

// TODO FIX
// @ts-expect-error
window.coreComponents = {};

export class CTextEditor extends CChunkDual {
    private m_buffer: CText;
    private m_clickHandler: CClickHandler = new CClickHandler();
    private m_control: CControl;
    private m_font: Font;
    private m_renderer: CRenderer;

    constructor( chunk: CChunkDual , private m_settings: any ) {
        super(  < CChunkFinal | CChunkDual > chunk.m_content , 
            [ 
               window.innerWidth , 
               window.innerHeight 
            ] , 
            chunk.m_orientation , 
            chunk.m_ratio , 
            [ 0 , 0 ] 
        );

        window.coreComponents.settings = m_settings;

        // init font
        window.coreComponents.font = {
            size: 24,
            fontname: "Consolas",
            calcWidth: 0,
            color: "#000"        
        };

        window.coreComponents.control = new CControl();
        window.coreComponents.renderer = new CRendererCanvas2D();

        this.m_font = window.coreComponents.font;
        this.m_control = window.coreComponents.control;
        this.m_buffer = window.gBuffer;
        this.m_renderer = window.coreComponents.renderer;

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
        this.m_renderer.SetFont( this.m_font.fontname , this.m_font.size );
        this.m_font.calcWidth = this.m_renderer.LetterWidth();
    }

    private ResizeCanvas() {
        this.SetFont();
        this.Rescale( [ this.m_renderer.Width() , this.m_renderer.Height() ] , [ 0 , 0 ] , this.m_ratio );
    }

    private Loop = ( time: number ) => {
        this.m_renderer.Clear();

        this.Draw();

        requestAnimationFrame( this.Loop );
    }

    public Process() {
        requestAnimationFrame( this.Loop );
    }
};
