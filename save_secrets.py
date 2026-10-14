import json
import os

data = [
  {"user_id": "02a5dc7c-f833-4206-98ab-18d84d9e8488", "password": "$2a$06$VHfNRpxEqtcHnYQiuQU9JeuBllwRjKW/frcshbV1A2YlyRVmjtd2."},
  {"user_id": "a25869f3-1931-489f-89a8-3ff4867ae1cd", "password": "$2a$06$jVdOkZXlk1bgLvOthMHpsukEFfCx/cu.9sQnpntHvZwvRsK6X6xT6"},
  {"user_id": "b2700254-57b5-4b91-bef2-d0228531fb95", "password": "$2a$06$yII4zHKV7CNK4z9/DO9e.uY.DylDtljCToBM2F0dS4xxZLZz6/7Ee"},
  {"user_id": "b98e4fd1-4839-42a3-aa28-d2c0f934d2a7", "password": "$2a$06$mtpxX1CcB3GoZXM.CcJmourI63iiiL3cuLyE6UOp.lbyHhMEeNB1q"},
  {"user_id": "1bf074e4-4d55-46cc-9bda-05d0a9c72df2", "password": "$2a$06$7egI9WxWDrdHphRqu/lpjurQIQgrxf9N2UJPEgJ8KT8ukJEp6SggS"},
  {"user_id": "d62f828c-acaa-4b53-9950-6b14f1d5730d", "password": "$2a$06$lq9whFzuzuV1LiIyyhBv5uT0CyAua0rUzYQDG2Y.qHGK4orkP3uVi"},
  {"user_id": "1c5a50c1-13be-4673-8fab-8980e113ae3d", "password": "$2a$06$u5KWmvPgADBGNuXQZVs6i.12b7K9LjXD0QEET8of2weSoV6Af1RKa"},
  {"user_id": "525d05db-80c7-40df-b276-92856cbe3b13", "password": "$2a$06$3a1vF4cKnAnZjs/VROv02.sbHBjVKx0Kd2Zv.wzJ5U9vr9W3IJ3h6"},
  {"user_id": "b2f06915-114d-4c07-931a-e1757e064c3d", "password": "$2a$06$wMGqjiOUIj73tObf6wPY/.TqhRaxSI8m.qtvN4mvMdBQg09AjEM7K"},
  {"user_id": "e58bab46-3c07-4137-ae0a-bbfb6c823f2f", "password": "$2a$06$cpIE3XrBZiI/qaolYaAmz.xiyMuGYOXh.Q.5xi1izgEWVKaGqSr9."},
  {"user_id": "63d5e255-6b05-48be-ada2-8704349a8ac2", "password": "$2a$10$U8cOIClAKWBIsAXFeVSHie8xW1zynV6bDoHGGGFlBY0F6Xacr/aM."},
  {"user_id": "15beff41-5ca9-4f92-8570-aa2a97747752", "password": "$2a$06$Gy1ZrBHkL68Cx7tJp7egkexFA9RroGYIItOYYLGYH3C/pRkVogUEu"},
  {"user_id": "8adfec89-c565-443a-9283-a14f6c76c207", "password": "$2a$10$EaCthpnKKloCLhrj51RCU.lJ03ma4xgYI7S0xZmNuVgUiXWkpaIHC"}
]

p = r'backup/full_backup_2026-10-14_09-13-35/user_secrets.json'
with open(p, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

summary_p = r'backup/full_backup_2026-10-14_09-13-35/_summary.json'
with open(summary_p, 'r', encoding='utf-8') as f:
    s = json.load(f)
s['tables_exported']['user_secrets'] = len(data)
with open(summary_p, 'w', encoding='utf-8') as f:
    json.dump(s, f, indent=2)

print('Updated user_secrets.json and _summary.json successfully!')
