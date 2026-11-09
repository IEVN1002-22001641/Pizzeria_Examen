class DevelopmentConfig():
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'admin'          
    MYSQL_PASSWORD = 'root'          
    MYSQL_DB = 'pizzeria_db'
    MYSQL_CURSORCLASS = 'DictCursor' 

config = {
    'development': DevelopmentConfig
}