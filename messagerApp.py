from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import os
import time

def setUpDriver():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get("https://web.whatsapp.com/")
    print("Scan the QR code with your phone to log in...")
    time.sleep(20)
    wait = WebDriverWait(driver, 60) 
    return driver, wait

def selectChat(driver, contact_name):
    search_box = driver.find_element(By.XPATH, '//div[@contenteditable="true"][@data-tab="3" or @data-tab="4"]')
    search_box.click()
    search_box.send_keys(contact_name)
    time.sleep(2)

    person = driver.find_element(By.XPATH, f'//span[@title="{contact_name}"]')
    person.click()
    time.sleep(2)


def sendMessage(wait,message):
    message_box = wait.until(
        EC.presence_of_element_located((By.XPATH, '//div[@contenteditable="true"][@aria-placeholder="Type a message"]'))
    )
    message_box.click()
    message_box.send_keys(message + Keys.ENTER)
    print('Message sent successfully!')

def run():
    driver, wait = setUpDriver()
    personName = 'Mom'
    selectChat(driver, personName)
    sendMessage(wait, f'Hello {personName} This is a test message from my automation script.')

file_path = os.path.abspath("sampleImage.jpeg") 

attach_button = wait.until(
        EC.presence_of_element_located((By.XPATH, '//div[@title="Attach"]'))
    )
attach_button.click()
attach_button.click()

file_input = wait.until(
    EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="file"]'))
)
file_input.send_keys(file_path)

send_button = wait.until(
    EC.element_to_be_clickable((By.XPATH, '//span[@data-icon="send"]'))
)
send_button.click()

print("Image sent successfully (without touching the paperclip)!")