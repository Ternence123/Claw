import sqlite3, json, sys
sys.stdout.reconfigure(encoding='utf-8')

db_path = r'C:\Users\Administrator\AppData\Roaming\WorkBuddy\automations\automations.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cur.fetchall()
print("Tables:", tables)

for table in tables:
    tname = table[0]
    cur.execute(f"PRAGMA table_info({tname})")
    cols = cur.fetchall()
    print(f"\n{tname} columns:", [c[1] for c in cols])
    cur.execute(f"SELECT * FROM {tname}")
    rows = cur.fetchall()
    print(f"{tname} rows:", len(rows))
    for row in rows[:5]:
        print("  ", str(row)[:200])

conn.close()

