const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });  // to use it in TourRouter


router.use(authController.protect);


// POST /tour/234fad4/reviews
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    // authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
.route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );



  module.exports = router;
