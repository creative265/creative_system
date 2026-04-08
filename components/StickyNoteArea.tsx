"use client";
import React, { useState } from 'react';
import { Note } from '@/app/page';
import { Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'

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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 content-start">
        {notes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-40 text-gray-400">
            <p>まだメモがありません。</p>
            <p className="text-sm">右のボードに書いて「追加」を押してください。</p>
          </div>
        ) : (
          notes.map((note) => (
            <motion.div 
              key={note.id} 
              onClick={() => setSelectedNote(note)}
              whileHover={{ scale: 1.05, y: -8}}
              whileTap={{ scale: 0.97 }}
              className="aspect-[360/300] bg-white-50 hover:bg-yellow-100 transition-colors rounded-lg shadow-sm border-l-4 border-yellow-400 p-3 flex flex-col cursor-pointer group"
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
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  title="削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex-1 w-full relative rounded-2xl overflow-hidden pointer-events-none">
                <motion.img 
                  layoutId={`image-${note.id}`}
                  src={note.imageUrl} 
                  alt="Handwritten note" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 拡大表示用のモーダル (Overlay) */}
      <AnimatePresence>
        {selectedNote && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"> 
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/30 backdrop-blur-2xl"
                onClick={() => setSelectedNote(null)} // 背景クリックで閉じる
              />
            {/* モーダル本体 */}
            <motion.div 
              layoutId={`card-${selectedNote.id}`}
              className="relative bg-white p-4 rounded-3xl w-fit max-w-[calc(92vh*360/300)] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden z-10 border border-gray-100" // overflow-hidden を追加
              onClick={(e) => e.stopPropagation()} // 中身のクリックで閉じないようにする
            >
              {/* モーダルのヘッダー */}
              <div className="flex justify-between items-center mb-4 px-2 shrink-0"> {/* shrink-0 を追加 */}
                <span className="font-bold text-gray-700">
                  記録日時: {formatDateTime(selectedNote.timestamp)}
                </span>
                <button 
                  onClick={() => setSelectedNote(null)}
                  className="p-1.5 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            
            {/* 拡大画像コンテナ */}
            {/* 修正：flex-1 と overflow-hidden を設定し、親コンテナの残りのスペースを使い切るようにする */}
              <div className="relative flex-1 w-full aspect-[360/300] rounded-2xl overflow-hidden border border-gray-100"> {/* p-4 -> p-2 に縮小 */}
                {/* 修正：max-w-full max-h-full と object-contain を設定 */}
                <motion.img 
                  layoutId={`image-${selectedNote.id}`}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}