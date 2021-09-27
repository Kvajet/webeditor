export type Coords = [ number , number ];

export class CRenderer {
    
    constructor() {

    }

    public Width() {
        return 0;
    }

    public Height() {
        return 0;
    }

    public SetFont( fontname: string , size: number ) {
    }

    public GetTextColor() {
        return "#000";
    }

    public SetTextColor( color: string ) {
    }

    public LetterWidth() {
        return 0;
    }

    public Clear() {
    }

    public RenderText( text: string , pos: Coords , maxWidth?: number | undefined ) {
    }

    public RenderRect( pos: Coords , size: Coords ) {
    }

    public RenderCircle( radius: number , pos: Coords ) {
    }
};

export class CRendererCanvas2D extends CRenderer {
    private m_canvas: HTMLCanvasElement;
    private m_context: CanvasRenderingContext2D;
    
    constructor() {
        super();

        const canvas = document.getElementById( 'editor' ) as HTMLCanvasElement | null;
        if( canvas == null )
            throw Error( "Unable to find canvas." );
        this.m_canvas = canvas;

        const context = this.m_canvas.getContext( '2d' );
        if( context == null ) 
            throw Error( "Unable  to initialize context." );
        this.m_context = context;

        window.addEventListener( 'resize' , this.CanvasSize.bind( this ) );

        this.InitCanvas();
    }

// PRIVATE
    private InitCanvas() {
        this.CanvasSize();
    }

    private CanvasSize() {
        this.m_canvas.width = window.innerWidth;
        this.m_canvas.height = window.innerHeight;
    }

// PUBLIC

    // TODO
    public Width() {
        return this.m_canvas.width;
    }

    // TODO
    public Height() {
        return this.m_canvas.height;
    }

    public SetFont( fontname: string , size: number ) {
        this.m_context.font = `${ size }px ${ fontname }`;
    }

    public GetTextColor() {
        return this.m_context.fillStyle.toString();
    }

    public SetTextColor( color: string ) {
        this.m_context.fillStyle = color;
    }

    public LetterWidth() {
        return this.m_context.measureText( 'A' ).width;
    }

    public Clear() {
        this.m_context.clearRect( 0 , 0 , this.m_canvas.width , this.m_canvas.height );
    }

    public RenderText( text: string , pos: Coords , maxWidth?: number | undefined ) {
        this.m_context.fillText( text , pos[ 0 ] , pos[ 1 ] , maxWidth );
    }

    // TODO
    public RenderRect( pos: Coords , size: Coords ) {
        this.m_context.fillRect( pos[ 0 ] , pos[ 1 ] , size[ 0 ] , size[ 1 ] );
    }

    public RenderCircle( radius: number , offset: Coords ) {
        const circle = new Path2D();
        circle.arc( radius + offset[ 0 ] , radius + offset[ 1 ] , radius , 0 , 2 * Math.PI );
        this.m_context.fill( circle );
    }
};
