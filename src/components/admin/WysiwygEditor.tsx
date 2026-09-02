import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { Extension } from '@tiptap/core';
import { Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, ChevronDown } from 'lucide-react';

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: { chain: any }) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }: { chain: any }) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
      },
    } as any;
  },
});

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function WysiwygEditor({ value, onChange, placeholder }: WysiwygEditorProps) {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      // Internal sync is handled by TipTap
    }
  }, [value, editor]);

  if (!editor) return null;

  const fonts = [
    { name: 'Default Font', value: '' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: "'Times New Roman', serif" },
    { name: 'Courier New', value: "'Courier New', monospace" },
    { name: 'Georgia', value: 'Georgia, serif' },
  ];

  const sizes = [
    { name: 'Size', value: '' },
    { name: '12px', value: '12px' },
    { name: '16px', value: '16px' },
    { name: '20px', value: '20px' },
    { name: '24px', value: '24px' },
    { name: '32px', value: '32px' },
    { name: '48px', value: '48px' },
    { name: '64px', value: '64px' },
    { name: '72px', value: '72px' },
    { name: '84px', value: '84px' },
    { name: '96px', value: '96px' },
    { name: '120px', value: '120px' },
    { name: '144px', value: '144px' },
  ];

  const currentFont = editor.getAttributes('textStyle').fontFamily || '';
  const currentFontName = fonts.find(f => f.value === currentFont)?.name || 'Default Font';
  
  const currentSize = editor.getAttributes('textStyle').fontSize || '';
  const currentSizeName = sizes.find(s => s.value === currentSize)?.name || 'Size';

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:border-black focus-within:ring-2 focus-within:ring-gray-200 transition-all flex flex-col wysiwyg-content">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 relative">
        
        {/* Custom Font Family Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setShowFontMenu(!showFontMenu); setShowSizeMenu(false); }}
            className="flex items-center gap-1 text-xs border border-gray-300 rounded px-2 py-1.5 bg-white hover:bg-gray-50 min-w-[120px] justify-between"
          >
            <span className="truncate">{currentFontName}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          
          {showFontMenu && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 shadow-xl rounded-lg py-1 z-50">
              {fonts.map(font => (
                <button
                  key={font.name}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    let chain = editor.chain().focus();
                    if (editor.state.selection.empty) chain = chain.selectAll();
                    
                    if (font.value) chain.setFontFamily(font.value).run();
                    else chain.unsetFontFamily().run();
                    setShowFontMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 ${currentFont === font.value ? 'bg-gray-50 font-bold' : ''}`}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Font Size Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setShowSizeMenu(!showSizeMenu); setShowFontMenu(false); }}
            className="flex items-center gap-1 text-xs border border-gray-300 rounded px-2 py-1.5 bg-white hover:bg-gray-50 min-w-[70px] justify-between"
          >
            <span>{currentSizeName}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          
          {showSizeMenu && (
            <div className="absolute top-full left-0 mt-1 w-24 bg-white border border-gray-200 shadow-xl rounded-lg py-1 z-50 max-h-[200px] overflow-y-auto">
              {sizes.map(size => (
                <button
                  key={size.name}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    let chain = editor.chain().focus();
                    if (editor.state.selection.empty) chain = chain.selectAll();

                    if (size.value) (chain as any).setFontSize(size.value).run();
                    else (chain as any).unsetFontSize().run();
                    setShowSizeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 ${currentSize === size.value ? 'bg-gray-50 font-bold' : ''}`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        <button 
          type="button" 
          onMouseDown={(e) => {
            e.preventDefault();
            let chain = editor.chain().focus();
            if (editor.state.selection.empty) chain = chain.selectAll();
            chain.toggleBold().run();
          }} 
          className={`p-1.5 rounded text-gray-700 hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => {
            e.preventDefault();
            let chain = editor.chain().focus();
            if (editor.state.selection.empty) chain = chain.selectAll();
            chain.toggleItalic().run();
          }} 
          className={`p-1.5 rounded text-gray-700 hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => {
            e.preventDefault();
            let chain = editor.chain().focus();
            if (editor.state.selection.empty) chain = chain.selectAll();
            chain.toggleUnderline().run();
          }} 
          className={`p-1.5 rounded text-gray-700 hover:bg-gray-200 transition-colors ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1"></div>
        
        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded px-1 cursor-pointer relative">
          <span className="text-xs font-medium text-gray-500 pl-1">Color:</span>
          <input 
            type="color" 
            onChange={(e) => {
              let chain = editor.chain().focus();
              if (editor.state.selection.empty) chain = chain.selectAll();
              chain.setColor(e.target.value).run();
            }} 
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="w-6 h-6 p-0 border-0 cursor-pointer bg-transparent" 
            title="Text Color"
          />
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        <button 
          type="button" 
          onMouseDown={(e) => {
            e.preventDefault();
            let chain = editor.chain().focus();
            if (editor.state.selection.empty) chain = chain.selectAll();
            chain.setTextAlign('left').run();
          }} 
          className={`p-1.5 rounded text-gray-700 hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => {
            e.preventDefault();
            let chain = editor.chain().focus();
            if (editor.state.selection.empty) chain = chain.selectAll();
            chain.setTextAlign('center').run();
          }} 
          className={`p-1.5 rounded text-gray-700 hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => {
            e.preventDefault();
            let chain = editor.chain().focus();
            if (editor.state.selection.empty) chain = chain.selectAll();
            chain.setTextAlign('right').run();
          }} 
          className={`p-1.5 rounded text-gray-700 hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[150px] max-h-[300px] overflow-y-auto outline-none [&_.ProseMirror]:min-h-[150px] [&_.ProseMirror]:outline-none [&_p]:m-0" 
      />
    </div>
  );
}
