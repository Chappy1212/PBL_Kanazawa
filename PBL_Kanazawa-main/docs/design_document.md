# 設計ドキュメント

## ユーザーDB (users)
| カラム名      | 型                      | 制約                         | 説明               |
|---------------|-------------------------|------------------------------|--------------------|
| user_id       | SERIAL                  | PRIMARY KEY                  | ユーザー一意ID     |
| username      | VARCHAR(50)             | UNIQUE NOT NULL              | ユーザー名         |
| email         | VARCHAR(255)            | UNIQUE NOT NULL              | メールアドレス     |
| created_at    | TIMESTAMP               | DEFAULT CURRENT_TIMESTAMP    | 作成日時           |
| updated_at    | TIMESTAMP               | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時           |

---

## コンタクトレンズ交換履歴DB (lens_change_histories)
| カラム名      | 型                      | 制約                         | 説明               |
|---------------|-------------------------|------------------------------|--------------------|
| history_id    | SERIAL                  | PRIMARY KEY                  | 履歴一意ID         |
| user_id       | INTEGER                 | REFERENCES users(user_id) ON DELETE CASCADE | ユーザーID（外部キー） |
| changed_at    | TIMESTAMP               | NOT NULL                     | 交換日             |
| note          | TEXT                    |                              | メモ・備考欄       |
| created_at    | TIMESTAMP               | DEFAULT CURRENT_TIMESTAMP    | 作成日時           |
| updated_at    | TIMESTAMP               | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時           |

---

## リマインダー設定DB (reminder_settings)
| カラム名      | 型                      | 制約                         | 説明               |
|---------------|-------------------------|------------------------------|--------------------|
| setting_id    | SERIAL                  | PRIMARY KEY                  | 設定一意ID         |
| user_id       | INTEGER                 | REFERENCES users(user_id) ON DELETE CASCADE | ユーザーID（外部キー） |
| cycle_days    | INTEGER                 | NOT NULL                     | 交換サイクル（日数）|
| notify_time   | TIME                    |                              | 通知時刻（任意）   |
| created_at    | TIMESTAMP               | DEFAULT CURRENT_TIMESTAMP    | 作成日時           |
| updated_at    | TIMESTAMP               | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時           |

---

## 追加説明
- **履歴管理、データの鮮度判断、ユーザー体験向上のため、全テーブルに作成日時・更新日時を追加しています。**
- **リマインダー設定はユーザーごとに1件想定ですが、将来拡張時のため1対多の形にしています。**
- **メモ欄（note）は履歴ごとに任意で記録可能です。**

---