import * as TextToSpeech from "@google-cloud/text-to-speech";

export class TtsInstance {
  private static readonly tts = new TextToSpeech.TextToSpeechClient();

  private static instance: TtsInstance | null;

  public static init(): TtsInstance {
    if (TtsInstance.instance == null) {
      TtsInstance.instance = new TtsInstance();
    }

    return TtsInstance.instance;
  }

  public tts(): TextToSpeech.v1.TextToSpeechClient {
    return TtsInstance.tts;
  }
}
