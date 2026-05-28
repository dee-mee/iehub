import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Bold,
    Essentials,
    Italic,
    Mention,
    Paragraph,
    Undo,
    Heading,
    List,
    Link,
    BlockQuote,
    Autoformat,
    Indent,
    IndentBlock,
    MediaEmbed,
    Table,
    TableToolbar,
    Alignment,
    Font,
    Highlight
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

interface RichTextEditorProps {
    value: string;
    onChange: (data: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    return (
        <div className="prose-editor">
            <CKEditor
                editor={ClassicEditor}
                config={{
                    toolbar: {
                        items: [
                            'undo', 'redo', '|',
                            'heading', '|',
                            'bold', 'italic', 'link', '|',
                            'bulletedList', 'numberedList', 'outdent', 'indent', '|',
                            'alignment', '|',
                            'blockQuote', 'insertTable', 'mediaEmbed', '|',
                            'fontSize', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
                            'removeFormat'
                        ],
                        shouldNotGroupWhenFull: true
                    },
                    plugins: [
                        Autoformat,
                        BlockQuote,
                        Bold,
                        Essentials,
                        Heading,
                        Italic,
                        Mention,
                        Paragraph,
                        Undo,
                        List,
                        Link,
                        Indent,
                        IndentBlock,
                        MediaEmbed,
                        Table,
                        TableToolbar,
                        Alignment,
                        Font,
                        Highlight
                    ],
                    placeholder: placeholder || 'Type your content here...',
                    mention: {
                        // Mention configuration if needed
                    },
                }}
                data={value}
                onChange={(_, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
        </div>
    );
}
