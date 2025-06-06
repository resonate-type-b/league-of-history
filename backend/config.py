import configparser
from pathlib import Path


config = configparser.ConfigParser()
config.read(Path(__file__).parent / 'config.ini')
config['PATH']['BASE'] = str(Path(__file__).parent)
