

export class CControl {

    public m_ctrl: boolean = false;
    
    private m_keyDownFunc: any;

    constructor() {
        document.addEventListener( 'keydown' , this.KeyDown.bind( this ) );
        document.addEventListener( 'keyup'   , this.KeyUp.bind( this ) );
    }

    public AddKeyDown( func: any ) {
        this.m_keyDownFunc = func;
    }

    public RemoveKeyDown() {
        this.m_keyDownFunc = null;
    }

    private KeyDown( ev: KeyboardEvent ) {
        switch( ev.key ) {
            case "Control": this.m_ctrl = true;  break;
            case "Tab":     ev.preventDefault(); break;
            default:                             break;
        }
        if( this.m_keyDownFunc != null ) {
            this.m_keyDownFunc( ev.key );
        }
    }

    private KeyUp( ev:KeyboardEvent ) {
        if( ev.key === "Control" ) {
            this.m_ctrl = false;
        }
    }
}
