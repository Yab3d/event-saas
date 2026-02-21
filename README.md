# usermodel

{
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["customer", "organizer", "admin"],
    default: "customer"
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  isVerifiedOrganizer: {
    type: Boolean,
    default: false
  },
  referralCode: String,
  createdAt: Date
}


# event model
{
  title: String,
  description: String,
  category: String,
  date: Date,
  location: String,
  image: String,

  organizer: {
    type: ObjectId,
    ref: "User"
  },

  legalDocumentUrl: String,

  status: {
    type: String,
    enum: ["draft", "pending", "approved", "rejected", "published"],
    default: "draft"
  },

  rejectionReason: String,

  totalRevenue: {
    type: Number,
    default: 0
  },

  averageRating: {
    type: Number,
    default: 0
  },

  totalTicketsSold: {
    type: Number,
    default: 0
  },

  createdAt: Date
}


# ticket tire model


{
  event: {
    type: ObjectId,
    ref: "Event"
  },

  name: String, // Early Bird, VIP, etc.

  price: Number,

  quantityAvailable: Number,

  quantitySold: {
    type: Number,
    default: 0
  }
}


# booking model

{
  user: {
    type: ObjectId,
    ref: "User"
  },

  event: {
    type: ObjectId,
    ref: "Event"
  },

  ticketTier: {
    type: ObjectId,
    ref: "TicketTier"
  },

  quantity: Number,

  totalAmount: Number,

  platformFeeAmount: Number,

  organizerRevenue: Number,

  referralCodeUsed: String,

  bookingStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  },

  payment: {
    type: ObjectId,
    ref: "Payment"
  },

  createdAt: Date
}

# ticket model

{
  booking: {
    type: ObjectId,
    ref: "Booking"
  },

  user: {
    type: ObjectId,
    ref: "User"
  },

  event: {
    type: ObjectId,
    ref: "Event"
  },

  ticketTier: {
    type: ObjectId,
    ref: "TicketTier"
  },

  qrCode: String,

  isUsed: {
    type: Boolean,
    default: false
  },

  issuedAt: Date
}


# payment model

{
  booking: {
    type: ObjectId,
    ref: "Booking"
  },

  transactionId: {
    type: String,
    unique: true
  },

  amount: Number,

  method: {
    type: String,
    enum: ["card", "mobile", "bank", "simulated"]
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed"]
  },

  createdAt: Date
}


# review model 

{
  user: {
    type: ObjectId,
    ref: "User"
  },

  event: {
    type: ObjectId,
    ref: "Event"
  },

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  comment: String,

  createdAt: Date
}














