'use strict';

var stripe = Stripe('pk_test_Q5u67wzIiLW764SnKQSBW8lu');
var elements = stripe.elements({
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Quicksand',
      },
    ],
    // Stripe's examples are localized to specific languages, but if
    // you wish to have Elements automatically detect your user's locale,
    // use `locale: 'auto'` instead.
    locale: window.__exampleLocale,
  });

  var elementStyles = {
    base: {
      color: '#fff',
      fontWeight: 600,
      fontFamily: 'Quicksand, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',

      ':focus': {
        color: '#424770',
      },

      '::placeholder': {
        color: '#9BACC8',
      },

      ':focus::placeholder': {
        color: '#CFD7DF',
      },
    },
    invalid: {
      color: '#fff',
      ':focus': {
        color: '#FA755A',
      },
      '::placeholder': {
        color: '#FFCCA5',
      },
    },
  };

  var elementClasses = {
    focus: 'focus',
    empty: 'empty',
    invalid: 'invalid',
  };

  var cardNumber = elements.create('cardNumber', {
    style: elementStyles,
    classes: elementClasses,
  });
  cardNumber.mount('#example3-card-number');

  var cardExpiry = elements.create('cardExpiry', {
    style: elementStyles,
    classes: elementClasses,
  });
  cardExpiry.mount('#example3-card-expiry');

  var cardCvc = elements.create('cardCvc', {
    style: elementStyles,
    classes: elementClasses,
  });
  cardCvc.mount('#example3-card-cvc');


// Handle real-time validation errors from the card-number Element.
cardNumber.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle real-time validation errors from the card-expiry Element.
cardExpiry.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle real-time validation errors from the card-cvc Element.
cardCvc.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});


function singlePayment(element) {
  console.log(cardNumber, cardExpiry, cardCvc);

  var email = $('#example3-email').val();
  var price = $(element).attr('data-price');
  var validated = true;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if ($.trim(email) === "") {
    $("#example3-email").focus();
    $("#example3-email-error").text('Please enter email id').show();
    validated = false;
  } else {
    if (re.test(email)) {
      validated = true;
    } else {
      $("#example3-email").focus();
      $("#example3-email-error").text('Please enter a valid email id').show();
      validated = false;
    }
  }


  var additionalData = {
    email: email ? email.value : undefined
  };
  if (validated === true) {
    stripe.createToken(cardNumber, additionalData).then(function(result) {
      if (result.error) {
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {

        var data = {
          email: email,
          price:price,
          token: result.token.id,
        };

        $.ajax({
            url: "http://localhost:5000/stripe/single-payment",
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data)
          })
          .then(function onSuccess(response) {
            $("#data").text(response.message);
          })
          .fail(function onFailure(error) {});
      }
    });
  }
}


