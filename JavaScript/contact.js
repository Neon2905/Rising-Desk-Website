function sendMail() {
    var firstName = document.getElementById('first_name').value;
    var lastName = document.getElementById('last_name').value;
    var email = document.getElementById('email').value;
    var subject = document.getElementById('subject').value;
    var message = document.getElementById('message').value;

    var mailtoLink = 'mailto:risingdesk@company.com?subject=' + encodeURIComponent(subject) +
                      '&body=' + encodeURIComponent('First Name: ' + firstName + '\n' +
                                                    'Last Name: ' + lastName + '\n' +
                                                    'Email: ' + email + '\n' + '\n' +
                                                    message);

    window.location.href = mailtoLink;
}