from flask import Flask, render_template, request, render_template_string

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('room1.html')

@app.route('/1')
def room1():
    return render_template('room1.html')

@app.route('/2') 
def room2():
    return render_template('room2.html')

@app.route('/3')
def room3():
    return render_template('room3.html')

@app.route('/4')
def room4():
    return render_template('room4.html')

@app.route('/5')
def room5():
    return render_template('room5.html')

@app.route('/6')
def room6():
    return render_template('room6.html')

@app.route('/7')
def room7():
    return render_template('room7.html')

@app.route('/8')
def room8():
    return render_template('room8.html')

@app.route('/9')
def room9():
    return render_template('room9.html')

@app.route('/10')
def room10():
    return render_template('room10.html')

# Custom 404 handler
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html')

# For local testing only:
if __name__ == '__main__':
    app.run(debug=True)
