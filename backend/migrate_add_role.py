"""
One-time migration script: adds the 'role' column to users table
and promotes a given email to admin.

Run from the backend/ folder with your venv activated:
    python migrate_add_role.py your@email.com
"""

import sys
from sqlalchemy import text
from app.database import engine

def main():
    if len(sys.argv) < 2:
        print("Usage: python migrate_add_role.py your@email.com")
        sys.exit(1)

    admin_email = sys.argv[1]

    with engine.connect() as conn:
        # Add column if it doesn't exist yet
        try:
            conn.execute(text(
                "ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user'"
            ))
            conn.commit()
            print("Added 'role' column to users table.")
        except Exception as e:
            print(f"Column may already exist, skipping ALTER TABLE: {e}")

        # Promote the given user to admin
        result = conn.execute(
            text("UPDATE users SET role = 'admin' WHERE email = :email"),
            {"email": admin_email},
        )
        conn.commit()

        if result.rowcount == 0:
            print(f"No user found with email {admin_email}. Register that account first, then re-run this script.")
        else:
            print(f"{admin_email} is now an admin.")

if __name__ == "__main__":
    main()