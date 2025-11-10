
## Migration 使用
### 初始流程
* 安裝套件
```bash
    npm install sequelize pg
    npm install --save-dev sequelize-cli
``` 
* 初始化: npx sequelize-cli init，之後會產生
```
    /my-project (專案根目錄)
    ├── package.json
    ├── node_modules/
    ├── src/        (您的應用程式邏輯，例如 Express 路由)
    ├── .env
    ├── migrations/  <-- CLI 建立
    ├── models/      <-- CLI 建立
    ├── seeders/     <-- CLI 建立
    └── config/      <-- CLI 建立
```

* 設定 config/config.json (db 連線設定)
```json
    {
        "development": {
            "username": "root",
            "password": "12345678",
            "database": "database_development",
            "host": "127.0.0.1",
            "dialect": "postgres"
        },
        "test": {
            "username": "root",
            "password": "12345678",
            "database": "database_test",
            "host": "127.0.0.1",
            "dialect": "postgres"
        },
        "production": {
            "username": "root",
            "password": "12345678",
            "database": "database_production",
            "host": "127.0.0.1",
            "dialect": "postgres"
        }
    }
```

* 建立資料庫
    ```
        npx sequelize-cli db:create
    ```

* 建立 Model
    ```bash
        npx sequelize-cli model:generate --name User --attributes username:string,email:string:unique,password_hash:string,is_active:boolean
    ```
    * 這樣會產生
        1. models/user.js
        2. migrations/[timestamp]-create-user.js

* 執行，將會在資料庫中創建 model
    ```
        npx sequelize-cli db:migrate
    ```

### 異動流程
* 增加 migration
    ```
        npx sequelize-cli migration:generate --name add-column-password-to-user-table
    ```
* 再到 @/migrations/xxxx-add-column-password-to-user-table 撰寫 up、down 用法

* 執行，將會生效
    ```
        npx sequelize-cli db:migrate
    ```
### 其他功能
* 狀態檢視
```
    npx sequelize-cli db:migrate:status
```

* 指定執行至第一個migration
```
    npx sequelize-cli db:migrate --to 20220802145931-init-hell-world.js
```

* 退回一個 migration
```
    npx sequelize-cli db:migrate:undo
```

* 退回所有 migration
```
    npx sequelize-cli db:migrate:undo:all
```