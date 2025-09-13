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
    previous_url = request.referrer or "/"
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 Not Found</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f8f8f8;
                margin: 0;
                padding: 50px;
            }}
            img {{
                max-width: 400px;
                margin: 20px 0;
            }}
            .message {{
                font-size: 1.5rem;
                margin-bottom: 20px;
            }}
        </style>
        <meta http-equiv="refresh" content="5;url={previous_url}">
    </head>
    <body>
        <h1>404 - Page Not Found</h1>
        <div class="message">
            Oops! The page you’re looking for doesn’t exist.<br>
            Redirecting you back in 5 seconds...
        </div>
        <img src="/static/404.gif" alt="404 image">
        <p><a href="{previous_url}">Click here if you are not redirected</a></p>
    </body>
    </html>
    """
    return render_template_string(html), 404

# For local testing only:
if __name__ == '__main__':
    app.run(debug=True)
