import pyttsx3
import wave


# 打包工具pyinstaller --onefile your_script.py
# 设置语音合成的参数
engine = pyttsx3.init()
engine.setProperty('rate', 150)  # 设置语速
engine.setProperty('volume', 0.5)  # 设置音量

# 要转换为语音的文本
text = "天之道,损有余而补不足,人之道,损不足以奉有余"

# 将文本转换为语音
engine.say(text)
engine.runAndWait()

# 获取语音输出并将其保存为WAV文件
with wave.open('output.wav', 'wb') as wav_file:
    wav_file.setnchannels(1)  # 单声道
    wav_file.setsampwidth(2)  # 16位采样深度
    wav_file.setframerate(44100)  # 44.1kHz采样率
    audio_data = engine.getProperty('outputBuffer')
    wav_file.writeframes(audio_data)