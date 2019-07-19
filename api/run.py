print('Starting Flask!')

import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='../web/build')

# Serve React App
@app.route('/', defaults={'path': ''})
def serve():
	return send_from_directory(app.static_folder, 'index.html')


@app.route('/api')
def api():
	return "api test!"

if __name__ == '__main__':
	app.run(use_reloader=True, port=5000, threaded=True)
