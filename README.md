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

# Command line

By default, all spreadsheets present in 'spreadsheets' array will be parsed. In case you want to parse a specific spreadsheet
you can you the command line argument -n followed by the name of the spreadsheet.

For example:

npm run start -n Test

# Creating relations

You can create relations within different tabs as follows:

- `Create a tab with the name __relation__`
- `Two columns one called tab-a and the other tab-b`
- `Third column called relation`

![alt tag](https://raw.githubusercontent.com/VictorGa/gspread-to-json/master/docs/relation.png)






