"use client";
import React, { useRef, useState } from 'react';
import HandwritingCanvas, { HandwritingCanvasHandle } from './HandwritingCanvas';
import { Trash2, PlusCircle } from 'lucide-react'; // アイコンを追加してプロ感を出す

interface ActionWidgetProps {
  onAddNote: (imageUrl: string) => void;
}

export default function ActionWidget({ onAddNote }: ActionWidgetProps) {
  const canvasHandleRef = useRef<HandwritingCanvasHandle>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleClear = () => {
    canvasHandleRef.current?.clear();
    setHasDrawn(false);
  };

  const handleAdd = () => {
    const dataUrl = canvasHandleRef.current?.getDataUrl();
    if (dataUrl) {
      onAddNote(dataUrl);
      handleClear();
    }
  };

  return (
    <div className="flex flex-col h-full w-full gap-4">
      {/* 描画エリア：絶対固定 */}
      <div className="flex-shrink-0 mx-auto shadow-xl rounded-2xl border border-gray-200 overflow-hidden bg-white" 
           style={{ width: 480, height: 480 }}>
        <HandwritingCanvas 
          ref={canvasHandleRef} 
          onStroke={() => setHasDrawn(true)} 
        />
      </div>
      
      {/* ボタンエリア：横並び（flex-row）かつ、縦に伸びる（flex-1） */}
      <div className="flex flex-row gap-3 flex-1 min-h-0">
        
        {/* クリアボタン：小さめ（flex-1） */}
        <button 
          onClick={handleClear}
          disabled={!hasDrawn}
          className={`flex-1 flex flex-col items-center justify-center gap-2 text-sm font-bold rounded-2xl transition-all border-2
            ${hasDrawn 
              ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100 active:scale-95' 
              : 'bg-gray-100 border-transparent text-gray-300 cursor-not-allowed opacity-50'}`}
        >
          <Trash2 size={24} />
          <span>クリア</span>
        </button>

        {/* 追加ボタン：大きく（flex-[3]） */}
        <button 
          onClick={handleAdd}
          disabled={!hasDrawn}
          className={`flex-[3] flex flex-col items-center justify-center gap-2 text-2xl font-black rounded-3xl transition-all shadow-lg
            ${hasDrawn 
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-200' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}
        >
          <PlusCircle size={32} />
          <span>ノートに追加</span>
        </button>

      </div>
    </div>
  );
}