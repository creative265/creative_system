"use client";
import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';

// 外から clearCanvas を呼べるように forwardRef を使用
export interface HandwritingCanvasHandle {
  clear: () => void;
  getDataUrl: () => string | undefined;
}

const CANVAS_WIDTH = 460;
const CANVAS_HEIGHT = 500;

const HandwritingCanvas = forwardRef<HandwritingCanvasHandle, { onStroke: () => void }>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 親コンポーネント（ActionWidget）から操作できるように公開
  useImperativeHandle(ref, () => ({
    clear: () => {
      const ctx = contextRef.current;
      if (ctx) ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    },
    getDataUrl: () => canvasRef.current?.toDataURL('image/png')
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 4;
    contextRef.current = ctx;
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  return (
    <canvas
      ref={canvasRef}
      className="touch-none bg-transparent block cursor-crosshair touch-none bg-white"
      onMouseDown={(e) => {
        const { x, y } = getCoordinates(e);
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(x, y);
        setIsDrawing(true);
        props.onStroke(); // 描画開始を親に通知
      }}
      onMouseMove={(e) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);
        contextRef.current?.lineTo(x, y);
        contextRef.current?.stroke();
      }}
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
      onTouchStart={(e) => {
        if (e.cancelable) e.preventDefault();
        const { x, y } = getCoordinates(e);
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(x, y);
        setIsDrawing(true);
        props.onStroke();
      }}
      onTouchMove={(e) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);
        contextRef.current?.lineTo(x, y);
        contextRef.current?.stroke();
      }}
      onTouchEnd={() => setIsDrawing(false)}
    />
  );
});

HandwritingCanvas.displayName = "HandwritingCanvas";
export default HandwritingCanvas;