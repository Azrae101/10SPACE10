from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('room1.html')

@app.route('/room1')
def room1():
    return render_template('room1.html')

@app.route('/room2')
def room2():
    return render_template('room2.html')

@app.route('/room3')
def room3():
    return render_template('room3.html')

@app.route('/room4')
def room4():
    return render_template('room4.html')

@app.route('/room5')
def room5():
    return render_template('room5.html')

if __name__ == '__main__':
    app.run(debug=True)
