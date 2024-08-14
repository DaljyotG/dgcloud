$(document).ready(function (e) {
    $win = $(window);
    $navbar = $('#header');
    $toggle = $('.toggle-button');
    var width = $navbar.width();
    toggle_onclick($win, $navbar, width);

    // resize event
    $win.resize(function () {
        toggle_onclick($win, $navbar, width);
    });

    $toggle.click(function (e) {
        $navbar.toggleClass("toggle-left");
    })

});

function toggle_onclick($win, $navbar, width) {
    if ($win.width() <= 768) {
        $navbar.css({ left: `-${width}px` });
    } else {
        $navbar.css({ left: '0px' });
    }
}

var typed = new Typed('#typed', {
    strings: [
        'Cloud Engineer',
        'Cloud Architect',
        'DevOps Engineer'
    ],
    typeSpeed: 50,
    backSpeed: 50,
    loop: true
});

var typed_2 = new Typed('#typed_2', {
    strings: [
        'Cloud Engineer',
        'Cloud Architect',
        'DevOps Engineer'
    ],
    typeSpeed: 50,
    backSpeed: 50,
    loop: true
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const counter = document.querySelector(".counter-number");
async function updateCounter() {
    let response = await fetch("https://xglb3co5tlhyioj7cmpk5x2zby0kfheu.lambda-url.us-east-1.on.aws/");
    let data = await response.json();
    counter.innerHTML = `Views: ${data}`;
}
updateCounter();

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Create a data object to send to the Lambda function
    const data = {
        name: name,
        phone: phone,
        email: email,
        message: message
    };

    // Define the API Gateway endpoint 
    const apiUrl = 'https://wf0vra8gq9.execute-api.us-east-1.amazonaws.com/ContactMe/ContactMe';

    // Send data to the Lambda function using the Fetch API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json()) // Parse the JSON response
    .then(responseBody => {
        // Log the full response for debugging
        console.log('Full response:', responseBody);

        // Check if the body field is already an object
        let body;
        try {
            body = responseBody.body;
            // If body is a string, parse it
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }
        } catch (e) {
            console.error('Error parsing body:', e);
            throw new Error('Failed to parse response body');
        }

        // Check if the status is success or failure
        if (body.message && body.message === 'Data stored successfully and email sent') {
            document.getElementById('responseBanner').innerText = 'Thank you for your message! We will get back to you soon.';
            document.getElementById('responseBanner').style.color = 'green';
        } else {
            throw new Error(body.message || 'An error occurred');
        }
        console.log('Success:', body);
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('responseBanner').innerText = 'There was an error sending your message. Please try again later.';
        document.getElementById('responseBanner').style.color = 'red';
    });
});
