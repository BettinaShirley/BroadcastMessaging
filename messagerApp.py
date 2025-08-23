from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import os
import time

# Setup Chrome with webdriver-manager
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# Open WhatsApp Web
driver.get("https://web.whatsapp.com/")
print("Scan the QR code with your phone to log in...")

# Give user time to scan QR code
time.sleep(20)

contact_name = "Mom"
message = "Hello, this is an automated message!"

wait = WebDriverWait(driver, 60)  # wait up to 60s for elements

# ✅ Find the search box (works in latest WhatsApp Web)
search_box = wait.until(
    EC.presence_of_element_located((By.XPATH, '//div[@contenteditable="true"][@data-tab="3" or @data-tab="4"]'))
)
search_box.click()
search_box.send_keys(contact_name)
time.sleep(2)

# ✅ Click the contact
person = driver.find_element(By.XPATH, f'//span[@title="{contact_name}"]')
person.click()
time.sleep(2)

# ✅ Find message input box (latest WhatsApp Web uses role="textbox")
message_box = wait.until(
    EC.presence_of_element_located((By.XPATH, '//div[@contenteditable="true"][@aria-placeholder="Type a message"]'))
)

# Send the message
message_box.click()
message_box.send_keys(message + Keys.ENTER)

print("Message sent successfully!")

file_path = os.path.abspath("sampleImage.jpeg")  # file in same directory

attach_button = wait.until(
    EC.presence_of_element_located((By.XPATH, '//div[@title="Attach"]'))
)
attach_button.click()

# ✅ Upload file using hidden input[type="file"]
file_input = wait.until(
    EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="file"]'))
)
file_input.send_keys(file_path)

# ✅ Wait for send button and click
send_button = wait.until(
    EC.element_to_be_clickable((By.XPATH, '//span[@data-icon="send"]'))
)
send_button.click()

print("Image sent successfully!")
