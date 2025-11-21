#!/usr/bin/env python3
"""
Миграция для добавления таблиц рекомендательной системы
"""
import sqlite3
import sys
import os

# Добавляем путь к корневой директории проекта
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

DB_PATH = 'Backend/aggregator.db'

def migrate():
    """Создает таблицы для рекомендательной системы"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Таблица для событий пользователей (клики, просмотры)
        print("➕ Создаем таблицу interactions...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                project_id INTEGER NOT NULL,
                event_type TEXT NOT NULL,
                ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (project_id) REFERENCES projects(id)
            )
        ''')

        # Индексы для быстрого доступа
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_interactions_user
            ON interactions(user_id, ts DESC)
        ''')
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_interactions_project
            ON interactions(project_id, ts DESC)
        ''')
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_interactions_event
            ON interactions(event_type, ts DESC)
        ''')
        print("✅ Таблица interactions создана")
        
        conn.commit()
        print("\n✅ Миграция успешно выполнена!")
        
    except Exception as e:
        print(f"❌ Ошибка при выполнении миграции: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("🚀 Запуск миграции рекомендательной системы...")
    migrate()


