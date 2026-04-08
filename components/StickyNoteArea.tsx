"use client";
import React, { useState } from 'react';
import { Note } from '@/app/page';
import { Trash2, X } from 'lucide-react';

interface StickyNoteAreaProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
}

export default function StickyNoteArea({ notes, onDeleteNote }: StickyNoteAreaProps) {
  // 拡大表示しているメモのState（nullなら何も拡大していない状態）
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // 日時をフォーマットする関数 (例: "3/14 11:34")
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 content-start">
        {notes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-40 text-gray-400">
            <p>まだメモがありません。</p>
            <p className="text-sm">右のボードに書いて「追加」を押してください。</p>
          </div>
        ) : (
          notes.map((note) => (
            // 修正：カード全体をクリック可能(cursor-pointer)にし、ホバー時に少し浮くアニメーションを追加
            <div 
              key={note.id} 
              onClick={() => setSelectedNote(note)}
              className="aspect-square bg-yellow-50 hover:bg-yellow-100 transition-colors rounded-lg shadow-sm border-l-4 border-yellow-400 p-3 flex flex-col cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-2">
                {/* 保存日時 */}
                <span className="text-xs text-gray-500 font-medium">
                  {formatDateTime(note.timestamp)}
                </span>
                
                {/* 削除ボタン */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // プロの必須処理：親のonClick(拡大)を発火させない
                    onDeleteNote(note.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  title="削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex-1 w-full relative bg-white rounded border border-gray-100 overflow-hidden pointer-events-none">
                <img 
                  src={note.imageUrl} 
                  alt="Handwritten note" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* 拡大表示用のモーダル (Overlay) */}
      {selectedNote && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" // p-8 -> p-4 に縮小
          onClick={() => setSelectedNote(null)} // 背景クリックで閉じる
        >
          {/* モーダル本体 */}
          <div 
            // 修正：max-w-4xl を維持しつつ、max-h-[90vh] を追加して、モーダル自体が画面高さを越えないように制限
            className="relative bg-white p-4 rounded-2xl w-fit max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" // overflow-hidden を追加
            onClick={(e) => e.stopPropagation()} // 中身のクリックで閉じないようにする
          >
            {/* モーダルのヘッダー */}
            <div className="flex justify-between items-center mb-4 px-2 shrink-0"> {/* shrink-0 を追加 */}
              <span className="font-bold text-gray-700">
                記録日時: {formatDateTime(selectedNote.timestamp)}
              </span>
              <button 
                onClick={() => setSelectedNote(null)}
                className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* 拡大画像コンテナ */}
            {/* 修正：flex-1 と overflow-hidden を設定し、親コンテナの残りのスペースを使い切るようにする */}
            <div className="relative mx-auto bg-white rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in duration-300
                w-full max-w-[90vw] md:max-w-[700px] lg:max-w-[900px] 
                max-h-[80vh] aspect-[360/300]"> 
              {/* 修正：max-w-full max-h-full と object-contain を設定 */}
              <img 
                src={selectedNote.imageUrl} 
                alt="Enlarged Note" 
                className="w-full h-full object-cover block" // プロの必須処理：contain で内に収める
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-white text-sm font-medium drop-shadow-md">
                  {formatDateTime(selectedNote.timestamp)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}