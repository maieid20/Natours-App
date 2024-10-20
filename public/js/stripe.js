// /* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51QA8xIGrZVRldmRBKOJp3LMKPBhGecxlNsyoR4f2Y1st7e9rWY75PzzVeP8sIQsEc4Q39bLa8vrgON4AuZiiArSG00lezJ3TSI',
    );

    // Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};