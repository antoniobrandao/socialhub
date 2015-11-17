
// mailer ==============================================================
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: {
    api_key: 'key-1-at3foewo876l2m9xlkue0g-igj3t75',
    domain: 'sandbox2f4f0bf94b6a431883136985112fc24c.mailgun.org'
  }
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

exports.send_email = function(email_html)
{
	console.log('::::::::::::::::::::::::::::::');
	console.log('::: Express ::: send_email :::');
	console.log('::::::::::::::::::::::::::::::');

	nodemailerMailgun.sendMail(
	{
		from: 'antoniobrandaodesign@gmail.com',
		to: 'addons­test@mailinator.com).',
		subject: 'SocialHub - Please enable this Addon!',
		'h:Reply-To': 'antoniobrandaodesign@gmail.com',
		html: email_html,
	}, 
		function (err, info) {
			if (err) {
				console.log('exports.send_email ::: Error: ' + err);
			}
			else {
				console.log('exports.send_email ::: Response: ' + info);
			}
		}
	)
}