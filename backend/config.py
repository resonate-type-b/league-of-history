import configparser
from pathlib import Path


config = configparser.ConfigParser()
config.read('config.ini')
config['PATH']['BASE'] = str(Path(__file__).parent)
