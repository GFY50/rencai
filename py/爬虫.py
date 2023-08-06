import requests  
from bs4 import BeautifulSoup  
  
# 发送HTTP请求  
url = 'https://www.runoob.com/'  
response = requests.get(url)  
  
# 解析HTML  
soup = BeautifulSoup(response.text, 'html.parser')  
  
# 提取电影标题和链接  
movies = soup.find('div', class_='col middle-column-home')  
juti=movies.find_all('div')
for movie in juti:  
    ju=movie.find_all('a')
    for mov in ju:
        title = mov.find('h4').text.strip()   
        link = mov.get('href')
        # print(title, link)
