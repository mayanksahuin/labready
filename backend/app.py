from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "LabReady backend is running!"
    })


@app.route("/api/test")
def test():
    return jsonify({
        "status": "success",
        "message": "Backend connected successfully"
    })


@app.route("/api/help", methods=["POST"])
def help_request():

    try:
        data = request.get_json()

        problem_type = data.get("problemType", "General")
        problem = data.get("problem", "").strip()

        if not problem:
            return jsonify({
                "status": "error",
                "message": "Please describe your problem."
            }), 400

        text = problem.lower()

        # -----------------------------
        # CODING ERROR
        # -----------------------------
        if problem_type == "Coding Error":

            if "syntax" in text:
                response = """A SyntaxError means Python found something
wrong with the structure of your code.

Try these steps:
1. Check brackets (), [], {}.
2. Check quotation marks.
3. Check whether a colon (:) is missing.
4. Check the line mentioned in the error message.

Tip: Read the error message from the bottom of the traceback first."""

            elif "indent" in text or "indentation" in text:
                response = """This looks like an indentation problem.

In Python, spaces are important.

Try:
1. Make sure statements inside the same block have the same indentation.
2. Avoid mixing tabs and spaces.
3. Check the line directly above the error.

Example:

if x > 5:
    print("Greater")

The print statement must be indented."""

            elif "nameerror" in text or "not defined" in text:
                response = """A NameError usually means Python cannot find
the variable or function you are using.

Check:
1. Is the variable spelled correctly?
2. Did you create the variable before using it?
3. Is the capitalization correct?

Example:

name = "Jayesh"
print(name)

Here, the variable must be created before print(name)."""

            else:
                response = """Let's troubleshoot your coding problem.

1. Read the exact error message.
2. Check the line number mentioned by Python.
3. Look for spelling, brackets, indentation, or missing symbols.
4. Run the program again after making one change at a time.

If possible, compare your code with the experiment example."""

        # -----------------------------
        # CONCEPT
        # -----------------------------
        elif problem_type == "Concept":

            if "variable" in text:
                response = """A variable is a name used to store a value.

Example:

age = 18
name = "Jayesh"

Here:
- age stores the number 18.
- name stores the text "Jayesh".

You can use the variable later:

print(age)
print(name)

Think of a variable like a labeled box that stores information."""

            elif "loop" in text:
                response = """A loop is used when you want to repeat
something multiple times.

Example:

for i in range(5):
    print(i)

This prints numbers from 0 to 4.

Common Python loops are:
- for loop
- while loop"""

            elif "function" in text:
                response = """A function is a reusable block of code.

Example:

def greet():
    print("Hello")

greet()

The function is created using def and can be called whenever you need it."""

            else:
                response = f"""Let's break this concept into simple steps.

You asked about:
{problem}

Start by identifying:
1. What the concept means.
2. Why it is used.
3. A small example.
4. Where it is used in your experiment.

Try connecting the concept to a small piece of code rather than memorizing it."""

        # -----------------------------
        # SOFTWARE ISSUE
        # -----------------------------
        elif problem_type == "Software Issue":

            if "python" in text and ("command" in text or "not working" in text):
                response = """Python may be installed but Windows may not
be finding the Python command.

Try these checks:

1. Open a new terminal.
2. Run:
   python --version

3. If that does not work, try:
   py --version

4. If both fail, check whether Python was added to PATH.

If you are using VS Code, also check that the correct Python interpreter
is selected."""

            elif "install" in text or "module" in text:
                response = """If a Python module is missing:

1. Check the exact module name in the error.
2. Make sure your virtual environment is activated.
3. Install the required package using pip.
4. Restart VS Code if necessary.
5. Run the program again."""

            else:
                response = f"""Let's troubleshoot the software issue.

Problem reported:
{problem}

Try:
1. Restart the application.
2. Check the exact error message.
3. Check whether the required software is installed.
4. Check your internet connection if installation is required.
5. Restart VS Code and try again.

If the problem continues, note the exact error message."""

        # -----------------------------
        # EXPERIMENT STEP
        # -----------------------------
        elif problem_type == "Experiment Step":

            response = f"""Let's go through the experiment step by step.

You reported:
{problem}

Before moving forward, check:

1. Is the previous step completed correctly?
2. Are all required files or programs open?
3. Did you enter the code exactly as shown?
4. Is there an error message?
5. Compare your output with the expected output.

If your output is different, identify the first step where your result
changed from the expected result."""

        # -----------------------------
        # GENERAL FALLBACK
        # -----------------------------
        else:

            response = f"""I understand your problem:

{problem}

Let's solve it step by step.

1. Identify exactly where you are stuck.
2. Check the error or unexpected result.
3. Compare it with the expected result.
4. Fix one issue at a time.
5. Run the experiment again.

LabReady is currently using its built-in troubleshooting assistant."""

        return jsonify({
            "status": "success",
            "response": response
        })

    except Exception as error:

        print("ERROR:", error)

        return jsonify({
            "status": "error",
            "message": "LabReady could not process the request."
        }), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )