# gspread-to-json

With this tool you can get your google spreadsheets into json files.


# How to use
- `npm install`
- `npm run build`
- `npm run start`


# Config
The configuration will be in the 'gspreadfile.js'.

You need the proper google auth information and must be in the file as:

```javascript
 "googleauth": {
       "private_key_id": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
       "private_key": "-----BEGIN PRIVATE KEY-----\xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-----END PRIVATE KEY-----\n",
       "client_email": "xxxxx@developer.gserviceaccount.com",
       "client_id": "xxxxx.apps.googleusercontent.com",
       "type": "service_account"
     }
 ```

Spreadsheet id's:

```javascript
"spreadsheets":[
    {
      "id": "XXXXXXX",
      "name": "name_test",
      "cleanSpaces": "false"
    }
```

If name is not set it, the file parsed will be with spreadsheet title set.






