import os


if os.getenv("DB_ENGINE", "mysql").lower() in {"mysql", "mariadb"}:
    try:
        import pymysql

        pymysql.version_info = (2, 2, 1, "final", 0)
        pymysql.install_as_MySQLdb()
    except Exception:
        pass
