from flask import Flask, render_template, request, jsonify, flash, redirect, url_for, current_app, session, redirect, Blueprint, make_response, abort
from flask_bootstrap import Bootstrap
from flask import send_from_directory
from flask import Flask, session
from flask_session import Session

# Create the flask app ##############################################
app = Flask(__name__)
bootstrap = Bootstrap(app)

# Other imports #####################################################
def get_static_file(path):
    site_root = os.path.realpath(os.path.dirname(__file__))
    return os.path.join(site_root, path)

def get_static_json(path):
    return json.load(open(get_static_file(path)))

@app.errorhandler(404)
def page_not_found(e):
    return jsonify(error=str(e)), 404

@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error('An error occurred: %s', str(e))
    # Return a generic 500 error message or render a custom template
    return 'An internal server error occurred', 500

@app.route('/', methods=['GET'])
def home():
    return render_template('home.html')

@app.route('/contact', methods=['GET'])
def contact():
    contact_config = {
        'form': {
            'action': 'https://formspree.io/f/yourFormID',
            'method': 'POST',
            'full_name_placeholder': 'Your Full Name',
            'email_placeholder': 'Your Email',
            'message_placeholder': 'Your Message'
        }
    }
    return render_template('contact.html', contact_enabled=True, contact_config=contact_config)

@app.route('/submit_contact_form', methods=['POST'])
def submit_contact_form():
    full_name = request.form['full_name']
    email = request.form['email']
    message = request.form['message']
    
    flash('Thank you for your message, we will get back to you soon!', 'success')
    return redirect('/contact')

if __name__ == '__main__':
    app.run(debug=False, use_reloader=False)