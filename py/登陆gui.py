import tkinter as tk  
from tkinter import messagebox  
import 爬虫
  
def check_credentials():  
    if entry_username.get() == 'admin' and entry_password.get() == 'password':  
        messagebox.showinfo('成功', '登录成功！')  
    else:  
        messagebox.showerror('错误', '用户名或密码错误，请重新输入！')  
  
root = tk.Tk()  
root.geometry("800x600+500+250") 
root.title('登录界面')  
  
label_username = tk.Label(root, text='用户名：')  
label_username.pack()  
  
entry_username = tk.Entry(root)  
entry_username.pack()  
  
label_password = tk.Label(root, text='密码：')  
label_password.pack()  
  
entry_password = tk.Entry(root, show='*')  
entry_password.pack()  
  
button_login = tk.Button(root, text='登录', command=check_credentials)  
button_login.pack()  
text = tk.Text(root)  
text.pack() 
text.config(wrap=tk.WORD) 
for movie in 爬虫.juti:  
    ju=movie.find_all('a')
    for mov in ju:
        title = mov.find('h4').text.strip()   
        link = mov.get('href')
        text.insert('end',title+'\t') 
        text.insert(tk.END,link+'\n')
root.mainloop()