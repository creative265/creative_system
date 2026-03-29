import { NextResponse } from 'next/server';

// あなたの ngrok URL
const JETSON_URL = "https://tetrastichous-workless-marty.ngrok-free.dev/predict";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // ブラウザから届いた音声ファイルを取り出す
    const audioFile = formData.get('audio_file') as File;
    if (!audioFile) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 });
    }

    // Jetson (Flask) へ送るための新しい FormData を作成
    const jetsonFormData = new FormData();
    // Flask側の `request.files['audio_file']` に合わせる
    jetsonFormData.append('audio_file', audioFile, 'recording.wav');

    console.log("Forwarding to Jetson via ngrok...");

    // Jetson へ POST リクエストを転送
    const response = await fetch(JETSON_URL, {
      method: 'POST',
      body: jetsonFormData,
      // ngrok の無料枠で表示される「警告画面」をスキップするためのヘッダー
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jetson (ngrok) Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Result from Jetson:", result);

    // Flask からのレスポンスを Next.js モーダルが期待する形式に変換
    return NextResponse.json({
      status: "success",
      healthy: (result.normal || 0) / 100, // 0.86 などの形式に
      MCI: (result.MCI || 0) / 100,
      Dementia: (result.dementia || 0) / 100,
      Conversation: result.text || "文字起こし失敗",
      score: result.score || 0,
      details: {
        ttr: result.features?.ttr || 0,
        speed: result.features?.articulation_rate || 0,
        silence_ratio: result.features?.silence_ratio || 0,
        abstract_rate: result.features?.abstract_rate || 0
      }
    });

  } catch (error: any) {
    console.error('Prediction Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}