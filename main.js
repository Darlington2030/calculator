// Select all elements with the class 'key', and select the input and output display elements
const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

// Initialize an empty string to store the user's input
let input = "";

// Loop through each key and set up an event listener for click events
for (let key of keys) {
    const value = key.dataset.key; // Get the value associated with the key

    key.addEventListener('click', () => {
        // Check if the 'clear' key was pressed, resetting the display
        if (value == "clear") {
            input = "";
            display_input.innerHTML = "";
            display_output.innerHTML = "";
        }
        // Check if the 'backspace' key was pressed, removing the last character
        else if (value == "backspace") {
            input = input.slice(0, -1); // Remove the last character
            display_input.innerHTML = CleanInput(input); // Update display
        }
        // Check if the '=' key was pressed, calculating the result
        else if (value == "=") {
            let result = eval(PerpareInput(input)); // Evaluate the input expression
            display_output.innerHTML = CleanOutput(result); // Display the result
        }
        // Check if the 'brackets' key was pressed, adding an open or close bracket
        else if (value == "brackets") {
            if (
                input.indexOf("(") == -1 ||
                (input.indexOf("(") != -1 && input.indexOf(")") != -1 && input.lastIndexOf("(") < input.lastIndexOf(")"))
            ) {
                input += "("; // Add an opening bracket
            } else if (
                input.indexOf("(") != -1 &&
                input.indexOf(")") == -1 ||
                (input.indexOf("(") != -1 && input.indexOf(")") != -1 && input.lastIndexOf("(") > input.lastIndexOf(")"))
            ) {
                input += ")"; // Add a closing bracket
            }

            display_input.innerHTML = CleanInput(input); // Update display
        }
        // For any other key, validate and add its value to the input if valid
        else {
            if (ValidateInput(value)) {
                input += value; // Append the value to input
                display_input.innerHTML = CleanInput(input); // Update display
            }
        }
    });
}

// Formats the input by styling operators and special characters
function CleanInput(input) {
    let input_array = input.split(""); // Convert input to an array of characters
    let input_array_length = input_array.length;

    for (let i = 0; i < input_array_length; i++) {
        // Replace operators and special characters with styled HTML spans
        if (input_array[i] == "*") {
            input_array[i] = ` <span class="operator">x</span> `;
        } else if (input_array[i] == "/") {
            input_array[i] = ` <span class="operator">÷</span> `;
        } else if (input_array[i] == "+") {
            input_array[i] = ` <span class="operator">+</span> `;
        } else if (input_array[i] == "-") {
            input_array[i] = ` <span class="operator">-</span> `;
        } else if (input_array[i] == "(") {
            input_array[i] = `<span class="brackets">(</span>`;
        } else if (input_array[i] == ")") {
            input_array[i] = `<span class="brackets">)</span>`;
        } else if (input_array[i] == "%") {
            input_array[i] = `<span class="percent">%</span>`;
        }
    }

    return input_array.join(""); // Join the array back into a string
}

// Formats the output by adding commas to large numbers and keeping decimals
function CleanOutput(output) {
    let output_string = output.toString(); // Convert output to a string
    let decimal = output_string.split(".")[1]; // Get the decimal part, if any
    output_string = output_string.split(".")[0]; // Get the integer part

    let output_array = output_string.split(""); // Split integer part into array

    // Add commas every three digits for readability
    if (output_array.length > 3) {
        for (let i = output_array.length - 3; i > 0; i -= 3) {
            output_array.splice(i, 0, ",");
        }
    }

    // If there's a decimal, add it back to the array
    if (decimal) {
        output_array.push(".");
        output_array.push(decimal);
    }

    return output_array.join(""); // Join the array back into a string
}

// Validates input to prevent consecutive operators and duplicate decimals
function ValidateInput(value) {
    let last_input = input.slice(-1); // Get the last character of the current input
    let operators = ["+", "-", "*", "/"];

    // Prevent consecutive decimals
    if (value == "." && last_input == ".") {
        return false;
    }

    // Prevent consecutive operators
    if (operators.includes(value)) {
        if (operators.includes(last_input)) {
            return false;
        } else {
            return true;
        }
    }

    return true; // Allow valid input
}

// Prepares the input string for evaluation by replacing '%' with '/100'
function PerpareInput(input) {
    let input_array = input.split(""); // Split input into array

    // Replace '%' with division by 100
    for (let i = 0; i < input_array.length; i++) {
        if (input_array[i] == "%") {
            input_array[i] = "/100";
        }
    }

    return input_array.join(""); // Join the array back into a string
}