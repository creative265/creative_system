"use client";
import React, { useState } from 'react';
import { Note } from '@/app/page';
import { Trash2, X } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

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
    <LayoutGroup>
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
              layoutId={`card-${note.id}`}
              onClick={() => setSelectedNote(note)}
              whileHover={{ scale: 1.05, y: -8}}
              whileTap={{ scale: 0.97 }}
              style={{ borderLeftColor: '#0f518a' }}
              className="aspect-[360/300] bg-white transition-colors rounded-3xl shadow-lg border border-gray-100 border-l-[12px] p-6 flex flex-col cursor-pointer group"
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
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                  title="削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex-1 w-full relative rounded-2xl overflow-hidden pointer-events-none border border-gray-50 bg-gray-50/50">
                <motion.img 
                  layoutId={`image-${note.id}`}
                  src={note.imageUrl} 
                  alt="Handwritten note" 
                  className="w-full h-full object-coutain"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-3xl p-6"> 
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/30 backdrop-blur-3xl"
                onClick={() => setSelectedNote(null)} // 背景クリックで閉じる
              />
            {/* モーダル本体 */}
            <motion.div 
              layoutId={`card-${selectedNote.id}`}
              style={{ borderLeftColor: '#0f518a' }}
              className="relative bg-white p-6 rounded-3xl w-full max-w-[calc(92vh*360/300)] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden z-10 border border-gray-100 border-l-[16px]" // overflow-hidden を追加
              onClick={(e) => e.stopPropagation()} // 中身のクリックで閉じないようにする
            >
              {/* モーダルのヘッダー */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                // 【修正】 mbを5に
                className="flex justify-between items-center mb-5 px-1 shrink-0"
              >
                {/* 【修正】 text-2xlに */}
                <span className="font-bold text-gray-800 text-2xl">
                  記録日時: {formatDateTime(selectedNote.timestamp)}
                </span>
                <button 
                  onClick={() => setSelectedNote(null)}
                  // 【修正】 roundedをxlに
                  className="p-1.5 text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
                >
                  <X size={28} />
                </button>
              </motion.div>
            
            {/* 拡大画像コンテナ */}
            {/* 修正：flex-1 と overflow-hidden を設定し、親コンテナの残りのスペースを使い切るようにする */}
              <div className="relative flex-1 w-full aspect-[360/300] rounded-2xl overflow-hidden border border-gray-100"> {/* p-4 -> p-2 に縮小 */}
                {/* 修正：max-w-full max-h-full と object-contain を設定 */}
                <motion.img 
                  layoutId={`image-${selectedNote.id}`}
                    src={selectedNote.imageUrl} 
                    alt="Enlarged Note" 
                    className="w-full h-full object-contain block" // プロの必須処理：contain で内に収める
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}