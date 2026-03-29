import { NextResponse } from 'next/server';

// ngrok の URL (変更があればここを書き換えてください)
const JETSON_URL = "https://tetrastichous-workless-marty.ngrok-free.dev/predict";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // ブラウザから届いた音声ファイルを取り出す
    const audioFile = formData.get('audio_file') as File;
    
    if (!audioFile) {
      console.error("Vercel Error: audio_file not found in browser request");
      return NextResponse.json({ error: "No audio file" }, { status: 400 });
    }

    // --- Jetson (Flask) へ送るための新しい箱(FormData)を作る ---
    const jetsonFormData = new FormData();
    
    // server.py の request.files['audio_file'] に合わせて、音声のみを追加
    // 画像ファイルはあえて追加せず、音声だけをパッキングします
    jetsonFormData.append('audio_file', audioFile, 'recording.wav');

    console.log(`Forwarding ONLY audio to Jetson (Size: ${audioFile.size} bytes)`);

    const response = await fetch(JETSON_URL, {
      method: 'POST',
      body: jetsonFormData,
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jetson Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Result from Jetson:", result);

    // Jetson(Flask)のレスポンス形式を、フロントのモーダル用に変換
    // Flask側: normal, MCI, dementia, text, features...
    return NextResponse.json({
      status: "success",
      healthy: (result.normal || 0) / 100, 
      MCI: (result.MCI || 0) / 100,
      Dementia: (result.dementia || 0) / 100,
      Conversation: result.text || "文字起こしなし",
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