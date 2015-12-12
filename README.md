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

# Supported tab types

- [name]__obj_parse : Indicates the tab contains a 'dot' separeted properties that need to be parsed as an object.
- [name]__dict : Indicates the tab will be parse as a dictionary. ´id´ column must exist.

# Supported cell values

- Arrays as [1,2,3]
- JSON objects as {"lat": 1, "lon":40}
- Strings
- Numbers

# Locales

You can set different locales for a tab just by setting the locale in the column.

For example if you want to have 'en' and 'es' locale it should look like this:

![alt tag](https://raw.githubusercontent.com/VictorGa/gspread-to-json/master/docs/locale.png)

This will generate a file per locale with the information of that tab.

# Creating relations

You can create relations within different tabs as follows:

- `Create a tab with the name __relation__`
- `Two columns one called tab-a and the other tab-b`
- `Third column called relation`

![alt tag](https://raw.githubusercontent.com/VictorGa/gspread-to-json/master/docs/relation.png)

In this example, the objects in `test2` tab will be placed in `test3` tab linked by id.

# API RESTFul 

You can run a node server (node build/server.js) to get access to RESTful API:

parse/:spreadsheetId --> Download a zip file with all json files related with that spreadsheet.

# Contributing

You are more than welcome to contribute to this project.
Please keep in mind that all unit tests should pass.







