from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('room1.html')

@app.route('/room1')
def room1():
    return render_template('room1.html')

@app.route('/room2') # Room 4 in notes
def room2():
    return render_template('room2.html')

@app.route('/room3')
def room3():
    return render_template('room3.html')

@app.route('/room4')
def room4():
    return render_template('room4.html')

@app.route('/room6')
def room6():
    return render_template('room6.html')

@app.route('/room7')
def room7():
    return render_template('room7.html')

@app.route('/room8')
def room8():
    return render_template('room8.html')

# For local testing only:
if __name__ == '__main__':
    app.run(debug=True)