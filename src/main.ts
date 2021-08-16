import { CChunkAbstract } from './CChunk';
import { CTextEditor } from './CTextEditor';
import settings from './settings';

try {
    const res = await CChunkAbstract.Construct( settings );
    const editor = new CTextEditor( res , settings );
    editor.Process();
} catch( err: any ) {
    console.log( err );
}
