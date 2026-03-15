"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StickyNoteArea from '@/components/StickyNoteArea';
import ActionWidget from '@/components/ActionWidget';
import RecordingWidget from '@/components/RecordingWidget';

export type Note = {
  id: string;
  imageUrl: string;
  timestamp: Date;
};

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const handleAddNote = (imageUrl: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      imageUrl,
      timestamp: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    // isRecording が true の時だけ「リング状のグロウ効果」を付与
    <div className={`flex h-screen w-full bg-[#F8F9FA] overflow-hidden relative transition-all duration-700 ${
      isRecording ? 'shadow-[inset_0_0_60px_rgba(239,68,68,0.5)]' : ''
    }`}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="absolute top-0 left-0 w-full h-16 flex items-center justify-center pointer-events-none z-10">
        <h1 className="text-2xl font-bold text-gray-700 tracking-wider">VocaBoard</h1>
      </div>

      <main className="flex flex-1 h-full p-4 pt-16 gap-6 overflow-hidden">
        <section className={`flex-1 h-full flex flex-col min-h-0 overflow-hidden transition-all duration-500 rounded-3xl border
          ${isRecording ? 'border-red-300 bg-red-50/20' : 'border-gray-200 bg-white/40'}`}>
          
          <div className="flex-1 overflow-y-auto pr-2 pb-2">
            <StickyNoteArea notes={notes} onDeleteNote={handleDeleteNote} />
          </div>
          
          {/* 修正されたウィジェット */}
          <RecordingWidget onStatusChange={setIsRecording} />
        </section>

        {/* 右側：キャンバス固定エリア */}
        <section className="h-full flex flex-col pb-2 min-h-0 w-[500px] flex-shrink-0">
          <ActionWidget onAddNote={handleAddNote} />
        </section>
      </main>
    </div>
  );
}