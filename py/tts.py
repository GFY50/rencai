from gtts import gTTS
text = "今天天气真好" 
tts = gTTS(text, lang='zh') 
tts.save("today.mp3")
