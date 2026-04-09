"use client";
import React, { useRef, useState } from 'react';
import HandwritingCanvas, { HandwritingCanvasHandle } from './HandwritingCanvas';
import { Trash2, PlusCircle } from 'lucide-react';

export default function ActionWidget({ onAddNote }: { onAddNote: (url: string) => void }) {
  const canvasHandleRef = useRef<HandwritingCanvasHandle>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  // サイズ管理
  const CANVAS_WIDTH = 360;
  const CANVAS_HEIGHT = 300;

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
    <div className="flex flex-row items-start justify-center w-full gap-4">
      {/* ボタンエリア */}
      <div className="flex flex-col gap-3 w-24 shrink-0" style={{ height: CANVAS_HEIGHT}}>
        <button 
          onClick={handleAdd}
          disabled={!hasDrawn}
          className={`flex-1 flex flex-col items-center justify-center gap-2 text-sm font-black rounded-2xl transition-all border-2 border-transparent
            ${hasDrawn ? 'bg-blue-600 text-white active:scale-95' : 'bg-gray-100 text-gray-300'}`}
        >
          <PlusCircle size={28} />
          <span>追加</span>
        </button>

        <button 
          onClick={handleClear}
          disabled={!hasDrawn}
          className={`h-24 flex flex-col items-center justify-center gap-1 text-xs font-bold rounded-2xl transition-all border-2
            ${hasDrawn ? 'bg-white border-gray-200 text-gray-400 active:scale-95' : 'bg-gray-50 border-gray-100 text-gray-200 opacity-50'}`}
        >
          <Trash2 size={18} />
          <span>クリア</span>
        </button>
      </div>
      
      <div 
        className="flex-shrink-0 shadow-xl rounded-2xl border border-gray-200 overflow-hidden bg-white" 
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        <HandwritingCanvas 
          ref={canvasHandleRef} 
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onStroke={() => setHasDrawn(true)} 
        />
      </div> 
    </div>
  );
}