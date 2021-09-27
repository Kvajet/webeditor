import { Font , Cursor } from "./interface";
import { CChunkFinal , Details } from "./CChunk";
import { CControl } from "./CControl";
import { CRenderer } from "./CRenderer";

interface File {
    name: string;
    content: string[];
    pos: [ number , number ];
};

export class CText extends CChunkFinal {
    public m_storage: File[] = [ { name: "new-file.txt", content: [ "" ], pos: [ 0 , 0 ] } ];
    public m_storagePos: number = 0;

    public m_text: string[] = this.m_storage[ this.m_storagePos ].content;
    public m_pos: [ number , number ] = this.m_storage[ this.m_storagePos ].pos;
    private m_font: Font;

    private m_cursor: Cursor;
    private m_control: CControl;
    private m_renderer: CRenderer;

    constructor( size: [ number , number ] , offset: [ number , number ] , details: Details | undefined = undefined ) {
        super( size , offset , details );

        this.m_font = window.coreComponents.font;
        this.m_control = window.coreComponents.control;
        this.m_renderer = window.coreComponents.renderer;

        this.m_cursor = {
            width: 3,
            height: 24,
            color: "#FFF",
            Draw: () => {
                const curCol = this.m_renderer.GetTextColor();

                this.m_renderer.SetTextColor( this.m_background );

                this.m_renderer.RenderRect( 
                    [
                        this.m_offset[ 0 ] + this.m_pos[ 0 ] * this.m_font.calcWidth + 5 , 
                        this.m_offset[ 1 ] + this.m_pos[ 1 ] * this.m_cursor.height , 
                    ],
                    [ this.m_cursor.width , this.m_cursor.height ]
                );
                this.m_renderer.SetTextColor( curCol );
            }
        };
    }

    private Write( key: string ) {
        this.m_text[ this.m_pos[ 1 ] ] = this.m_text[ this.m_pos[ 1 ] ].slice( 0 , this.m_pos[ 0 ] ) 
                                         + key
                                         + this.m_text[ this.m_pos[ 1 ] ].slice( this.m_pos[ 0 ] );
        this.Right();
    }

    private Erase() {
        // start of line
        if( this.m_pos[ 0 ] === 0 ) {
            // start of document
            if( this.m_pos[ 1 ] === 0 ) {
                return;
            }
            const actLen = this.m_text[ this.m_pos[ 1 ] - 1 ].length;

            // start of line, merge
            this.m_text[ this.m_pos[ 1 ] - 1 ] = this.m_text[ this.m_pos[ 1 ] - 1 ] + this.m_text[ this.m_pos[ 1 ] ];

            this.m_text.splice( this.m_pos[ 1 ] , 1 );
            this.m_pos[ 1 ]--;
            this.m_pos[ 0 ] = actLen;
        } else {
            // remove from inline
            this.m_text[ this.m_pos[ 1 ] ] =   this.m_text[ this.m_pos[ 1 ] ].slice( 0 , this.m_pos[ 0 ] - 1 ) 
                                                + this.m_text[ this.m_pos[ 1 ] ].slice( this.m_pos[ 0 ] );
            this.m_pos[ 0 ]--;
        }
    }

    private EraseWord() {
        if( this.m_pos[ 0 ] === 0 ) {
            this.Erase();
        } else {
            const [ begin , end ] = this.FindLeftWord();
            this.m_text[ this.m_pos[ 1 ] ] =   this.m_text[ this.m_pos[ 1 ] ].slice( 0 , begin )
                                             + this.m_text[ this.m_pos[ 1 ] ].slice( end + 1 );
            this.m_pos[ 0 ] -= ( end - begin + 1 );
        }
    }

    private Delete() {
        if( this.m_pos[ 0 ] === this.m_text[ this.m_pos[ 1 ] ].length ) {
            // end of document
            if( this.m_pos[ 1 ] + 1 === this.m_text.length ) {
                return;
            }
            // end of line, not document one
            this.m_text[ this.m_pos[ 1 ] ] += this.m_text[ this.m_pos[ 1 ] + 1 ];
            this.m_text.splice( this.m_pos[ 1 ] + 1 , 1 );
        // < 0 , end ) of the line
        } else {
            this.m_text[ this.m_pos[ 1 ] ] =   this.m_text[ this.m_pos[ 1 ] ].slice( 0 , this.m_pos[ 0 ] )
                                             + this.m_text[ this.m_pos[ 1 ] ].slice( this.m_pos[ 0 ] + 1 );
        }
    }

    private DeleteWord() {
        if( this.m_pos[ 0 ] === this.m_text[ this.m_pos[ 1 ] ].length ) {
            this.Delete();
        } else {
            const [ begin , end ] = this.FindRightWord();

            this.m_text[ this.m_pos[ 1 ] ] =   this.m_text[ this.m_pos[ 1 ] ].slice( 0 , begin )
                                             + this.m_text[ this.m_pos[ 1 ] ].slice( end + 1 );
        }
    }

    private FindLeftWord(): [ number , number ] {
        const end = this.m_pos[ 0 ] - 1;
        let begin = end - 1;

        let space = this.m_text[ this.m_pos[ 1 ] ][ end ] === ' ';

        for( ; begin >= 0 ; begin-- ) {
            if( space ) {
                if( this.m_text[ this.m_pos[ 1 ] ][ begin ] !== " " ) {
                    begin++;
                    break;
                }
            } else {
                if( this.m_text[ this.m_pos[ 1 ] ][ begin ] === ' ' ) {
                    begin++;
                    break;
                }
            }
        }
        begin = Math.max( begin , 0 );
        return [ begin , end ];
    }

    private LeftWord() {
        if( this.m_pos[ 0 ] === 0 ) {
            this.Left();
        } else {
            const [ begin , end ] = this.FindLeftWord();
            this.m_pos[ 0 ] -= ( end - begin + 1 );
        }
    }

    private Left() {
        if( this.m_pos[ 0 ] === 0 ) {
            if( this.m_pos[ 1 ] === 0 ) {
                return;
            }
            this.m_pos[ 1 ]--;
            this.m_pos[ 0 ] = this.m_text[ this.m_pos[ 1 ] ].length;
        } else {
            this.m_pos[ 0 ]--;
        }
    }

    private FindRightWord(): [ number , number ] {
        const begin = this.m_pos[ 0 ];
        let end = begin + 1;

        let space = this.m_text[ this.m_pos[ 1 ] ][ begin ] === ' ';

        for( ; end < this.m_text[ this.m_pos[ 1 ] ].length ; end++ ) {
            if( space ) {
                if( this.m_text[ this.m_pos[ 1 ] ][ end ] !== " " ) {
                    end--;
                    break;
                }
            } else {
                if( this.m_text[ this.m_pos[ 1 ] ][ end ] === ' ' ) {
                    end--;
                    break;
                }
            }
        }

        end = Math.min( end , this.m_text[ this.m_pos[ 1 ] ].length - 1 );
        return [ begin , end ];
    }

    private RightWord() {
        if( this.m_pos[ 0 ] === this.m_text[ this.m_pos[ 1 ] ].length ) {
            this.Right();
        } else {
            const [ begin , end ] = this.FindRightWord();
            this.m_pos[ 0 ] += end - begin + 1;
        }
    }

    private Right() {
        if( this.m_pos[ 0 ] === this.m_text[ this.m_pos[ 1 ] ].length ) {
            if( this.m_pos[ 1 ] + 1 === this.m_text.length ) {
                return;
            }
            this.m_pos[ 1 ]++;
            this.m_pos[ 0 ] = 0;
        } else {
            this.m_pos[ 0 ]++;
        }
    }

    private Up() {
        if( this.m_pos[ 1 ] === 0 ) {
            this.m_pos[ 0 ] = 0;
        } else {
            if( this.m_pos[ 0 ] <= this.m_text[ this.m_pos[ 1 ] - 1 ].length ) {
                this.m_pos[ 1 ]--;
            } else {
                this.m_pos[ 1 ]--;
                this.m_pos[ 0 ] = this.m_text[ this.m_pos[ 1 ] ].length;
            }
        }
    }

    private Down() {
        if( this.m_pos[ 1 ] + 1 === this.m_text.length ) {
            this.m_pos[ 0 ] = this.m_text[ this.m_pos[ 1 ] ].length;
        } else {
            if( this.m_pos[ 0 ] <= this.m_text[ this.m_pos[ 1 ] + 1 ].length - 1 ) {
                this.m_pos[ 1 ]++;
            } else {
                this.m_pos[ 1 ]++;
                this.m_pos[ 0 ] = this.m_text[ this.m_pos[ 1 ] ].length;
            }
        }
    }

    private LeftMargin( nth: number ) {
        let margin = "";
        for( const char of this.m_text[ nth ] ) {
            if( char === " " ) margin += " ";
            else               break;
        }
        return margin;
    }

    private NewLine() {
        // at start of line, prepend line, stay on moved
        if( this.m_pos[ 0 ] === 0 ) {            
            this.InsertLine();
            this.m_pos[ 1 ]++;
        }
        // at end of line, append new line, move to new one
        else if( this.m_pos[ 0 ] === this.m_text[ this.m_pos[ 1 ] ].length ) {            
            this.InsertLine( 1 );

            const margin = this.LeftMargin( this.m_pos[ 1 ] );
            this.m_text[ this.m_pos[ 1 ] + 1 ] = margin;
            this.m_pos[ 1 ]++;
            this.m_pos[ 0 ] = margin.length;
        }
        // in the middle, split and move to second
        else {            
            this.InsertLine( 1 );

            const margin = this.LeftMargin( this.m_pos[ 1 ] );
            this.m_text[ this.m_pos[ 1 ] + 1 ] = margin + this.m_text[ this.m_pos[ 1 ] ].slice( this.m_pos[ 0 ] );
            this.m_text[ this.m_pos[ 1 ] ]     = this.m_text[ this.m_pos[ 1 ] ].slice( 0 , this.m_pos[ 0 ] );
            this.m_pos[ 1 ]++;
            this.m_pos[ 0 ] = margin.length;
        }
    }

    private InsertLine( off: number = 0 ) {
        if( this.m_pos[ 1 ] === this.m_text.length ) {
            this.m_text.push( "" );
        } else {
            this.m_text = [
                ...( this.m_text.slice( 0 , this.m_pos[ 1 ] + off ) ) ,
                "" ,
                ...( this.m_text.slice( this.m_pos[ 1 ] + off ) )
            ];
        }
    }

    private NextStorageItem() {
        // this.m_storage[ this.m_storagePos ].pos = this.m_pos;
        // this.m_storage[ this.m_storagePos ].content = this.m_text;

        this.m_storagePos = ( this.m_storagePos + 1 ) % this.m_storage.length;
        this.m_text = this.m_storage[ this.m_storagePos ].content;
        this.m_pos = this.m_storage[ this.m_storagePos ].pos;
    }

    private NewStorageItem() {
        // this.m_storage[ this.m_storagePos ].pos = this.m_pos;
        // this.m_storage[ this.m_storagePos ].content = this.m_text;

        this.m_storage.push({
            name: `new-file-${ this.m_storage.length }.txt`,
            content: [ "" ],
            pos: [ 0 , 0 ]
        });
        this.m_storagePos = this.m_storage.length - 1;
        this.m_text = this.m_storage[ this.m_storagePos ].content;
        this.m_pos = this.m_storage[ this.m_storagePos ].pos;
    }

    public Process( key: string ) {
        if( key.length === 1 && ! this.m_control.m_ctrl )  {
            this.Write( key );
        } else {
            switch( key ) {
                case "a":
                    this.NextStorageItem();
                    break;
                case "Alt":
                    if( this.m_control.m_ctrl ) this.PutText( JSON.stringify( window.coreComponents.settings ) );
                    break;
                case "ArrowDown":
                    this.Down();
                    break;
                case "ArrowLeft":
                    if( this.m_control.m_ctrl ) this.LeftWord();
                    else                        this.Left();
                    break;
                case "ArrowRight":
                    if( this.m_control.m_ctrl ) this.RightWord();
                    else                        this.Right();
                    break;
                case "ArrowUp":
                    this.Up();
                    break;
                case "Backspace":
                    if( this.m_control.m_ctrl ) this.EraseWord();
                    else                        this.Erase();
                    break;
                case "c":
                    this.NewStorageItem();
                    break;
                case "Delete":
                    if( this.m_control.m_ctrl ) this.DeleteWord();
                    else                        this.Delete();
                    break;
                case "Enter":
                    this.NewLine();
                    break;
                case "Shift":
                    if( this.m_control.m_ctrl ) this.ExportText();
                    break;
                case "Tab":
                    for( let i = 0 ; i < 4 ; i++ )
                        this.Write( " " );
                    break;
                default:
                    break;
            }    
        }
    }

    public Options( options: any ) {
        if( options == null )
            return;
        super.Options( options );
        if( options.cursorColor ) this.m_cursor.color = options.cursorColor;
    }

    public Draw() {
        // draw text, temporary - START
        const curCol = this.m_renderer.GetTextColor();

        this.m_renderer.SetTextColor( this.m_background );
        this.m_renderer.RenderRect( this.m_offset , this.m_size );

        this.m_renderer.SetTextColor( this.m_color );

        let off = this.m_font.size;
        for( const str of this.m_text ) {
            this.m_renderer.RenderText( str , [ this.m_offset[ 0 ] + 5 , this.m_offset[ 1 ] + off - 3 ] );
            off += this.m_font.size;
        }

        this.m_renderer.SetTextColor( curCol );
        // draw text, temporary - END

        this.m_cursor.Draw();

        console.log( this.m_storage[ this.m_storagePos ].pos === this.m_pos );
    }

    public Init() {
        this.m_font = window.coreComponents.font;
        this.m_control = window.coreComponents.control;
        this.m_renderer = window.coreComponents.renderer;

        const click = window.coreComponents.click;
        click.Register({
            x: this.m_offset[ 0 ],
            y: this.m_offset[ 1 ],
            width: this.m_size[ 0 ],
            height: this.m_size[ 1 ],
            Action: ( () => {
                this.m_background = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
            }).bind( this )
        });

        this.m_cursor = {
            width: 3,
            height: 24,
            color: "#FFF",
            Draw: () => {
                const curCol = this.m_renderer.GetTextColor();

                this.m_renderer.SetTextColor( this.m_cursor.color );

                this.m_renderer.RenderRect( 
                    [
                        this.m_offset[ 0 ] + this.m_pos[ 0 ] * this.m_font.calcWidth + 5 , 
                        this.m_offset[ 1 ] + this.m_pos[ 1 ] * this.m_cursor.height , 
                    ],
                    [ this.m_cursor.width , this.m_cursor.height ]
                );
                this.m_renderer.SetTextColor( curCol );
            }
        };
    }

    private ExportText() {
        let res = "";
        for( const str of this.m_text ) {
            res += str;
            res += "\n";
        }
        console.log( res );
    }

    private PutText( text: string ) {
        for( const char of text ) {
            if( char === "}") {
                this.NewLine();
                this.m_text[ this.m_pos[ 1 ] ] = this.m_text[ this.m_pos[ 1 ] ].slice( 0 , this.m_text[ this.m_pos[ 1 ] ].length - 4 );
            }
            this.Write( char );
            if( char === "{" ) {
                this.NewLine();
                for( let i = 0 ; i < 4 ; i++ )
                    this.Write( " " );
            } else if( char === "," ) {
                this.NewLine();
            }
        }
        this.NewLine();
    }
};
