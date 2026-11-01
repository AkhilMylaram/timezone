# PyMySQL compatibility wrapper for environments where mysqlclient is substituted
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except ImportError:
    pass
