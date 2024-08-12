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
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // API Endpoint URL
    const apiUrl = 'https://your-api-gateway-url/endpoint'; // Replace with your API Gateway URL

    // Create a payload
    const payload = {
        name: name,
        phone: phone,
        email: email,
        message: message
    };

    // Send POST request to the API Gateway
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        // Handle success response
        if (data.success) {
            displayBanner('Your message was sent successfully!', 'success');
        } else {
            displayBanner('There was an issue sending your message. Please try again.', 'error');
        }
    })
    .catch((error) => {
        // Handle error response
        displayBanner('Failed to send message. Please try again.', 'error');
    });
});

function displayBanner(message, type) {
    const banner = document.getElementById('responseBanner');
    banner.textContent = message;

    if (type === 'success') {
        banner.style.backgroundColor = '#d4edda'; // Light green
        banner.style.color = '#155724'; // Dark green text
    } else {
        banner.style.backgroundColor = '#f8d7da'; // Light red
        banner.style.color = '#721c24'; // Dark red text
    }

    banner.style.padding = '10px';
    banner.style.borderRadius = '5px';
}
