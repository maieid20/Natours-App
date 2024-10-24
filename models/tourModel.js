const mongoose=require("mongoose");
const slugify=require("slugify");


const tourSchema = new mongoose.Schema({
    name :{
      type : String,
      required: [ true, 'the tour must have a name'], 
      unique : true,
      trim:true ,  
      maxLength:[40 , ' a tour must have less or equla than 40 charachter '],
      minLength:[10,  'a tour must have more or equla than 40 charachter ']

    },

    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },

    duration: {
      type:Number,
      required: [ true, 'the tour must have a duration'] 
    },
    maxGroupSize:{
      type:Number,
      required: [ true, 'the tour must have a  maxGroupSize'] 
    },
    difficulty :{
      type:String,
      required: [ true, 'the tour must have a  difficulty '], 
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },

    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 
    },
    ratingQuantity: {
      type : Number,
      default : 0 
    },
    price :{
      type : Number, 
      required :[ true, 'the tour must have a price']
    },
    priceDiscount :{
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;           
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary:{
    type:String,
    trim:true ,  
    required :[ true, 'the tour must have a description']

    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,  
      required :[ true, 'the tour must have a imageCover']
    },
    images:[String],          
    createdAt:{                
      type:Date,
      default:Date.now()
    }  ,  
    startDates:[Date],          
    secretTour: {
      type: Boolean,
      default: false
    },

                                     
    startLocation: {
      
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']                          
      },
      coordinates: [Number],
      address: String,
      description: String
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']                 
        },
        coordinates: [Number],                           
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]

    },
    {
      toJSON:{  virtuals : true},   
      toObject:{virtuals : true}      
    }  
    );
    
    tourSchema.index({ price: 1, ratingsAverage: -1 });
    tourSchema.index({ slug: 1 });
    tourSchema.index({ startLocation: '2dsphere' });



     tourSchema.virtual('durationWeeks').get(function(){     
      return this.duration/7;                   
     });
     
     tourSchema.virtual('reviews', {
      ref: 'Review',
      foreignField: 'tour',
      localField: '_id'           
      });



    
    tourSchema.pre('save', function(next) {                
          this.slug = slugify(this.name, { lower: true });       
          next();
        });


        
      // QUERY MIDDLEWARE
    tourSchema.pre(/^find/, function(next) {
      this.find({ secretTour: { $ne: true } });

      this.start = Date.now();
      next();
    });

    tourSchema.post(/^find/, function(docs, next) {
      console.log(`Query took ${Date.now() - this.start} milliseconds!`);
      next();
    });

    tourSchema.pre(/^find/, function(next) {
      this.populate({
        path: 'guides',                         
        select: '-__v -passwordChangedAt'         
      });
    
      next();
    });

    

      
     const Tour = mongoose.model("Tour", tourSchema); // mode name must be in uppercase
     module.exports=Tour;
    
    