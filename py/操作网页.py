#引入time模块，实现延时
import time
#引入selenium库中的webdriver模块，实现对网页的操作
from selenium import webdriver
#引入By Class，辅助元素定位
from selenium.webdriver.common.by import By
#引入ActionChains Class，辅助鼠标移动
from selenium.webdriver.common.action_chains import ActionChains


#打开谷歌浏览器

driver = webdriver.Edge()
#打开网页
driver.get('https://www.9ekkc.com/') #将URL替换为需要操作的网址
el = driver.find_element(By.XPATH, "/html/body/nav/div/form/div/input")
el.send_keys('斗罗大陆')
sou=driver.find_element(By.XPATH,'/html/body/nav/div/form/div/button')
sou.click()