import { CTextEditor } from './CTextEditor';
import settings from './settings';

try {
    const res = await CTextEditor.Construct( settings );
    const editor = new CTextEditor( res , settings );
    editor.Process();
} catch( err ) {
    console.log( "[ERROR] " + err );
}
