import colorlog

# Create handler with colors
handler = colorlog.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
    "%(log_color)s%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%H:%M:%S",  # Only hours, minutes, seconds
    log_colors={
        'DEBUG':    'cyan',
        'INFO':     'green,bg_black',
        'WARNING':  'yellow',
        'ERROR':    'red,bg_black',
        'CRITICAL': 'red,bg_white',
    }
))
logger = colorlog.getLogger(__name__) # Create/get logger
logger.handlers = [] # Remove all existing handlers to prevent double logging
logger.addHandler(handler) # Add the color handler
logger.setLevel(colorlog.INFO) # Set level
logger.propagate = False
