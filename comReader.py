import serial
import time
import requests

ser = serial.Serial(port = '/dev/ttyS0', timeout = 5, baudrate = 9600, writeTimeout = 1)
ser.reset_output_buffer()
headers = { "content-type" : "text/plain" }
print("connected to: " + ser.portstr)

while True:
  bytesToRead = ser.inWaiting()
  s = ser.readline().decode('utf8')
  print(s)
  if "Temperature" in s:
    requests.post("http://localhost:8000/reading", data = s[16:].rstrip(), headers = headers)
