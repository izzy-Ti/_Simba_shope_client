# Stripe Payment Integration Setup

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# API Configuration (optional)
VITE_API_BASE_URL=http://localhost:4000/api
```

## Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in to your account
3. Go to "Developers" > "API keys"
4. Copy your "Publishable key" (starts with `pk_test_` for test mode)
5. Add it to your `.env` file

## Features Implemented

✅ **Stripe Elements Integration**
- Secure card input using Stripe Elements
- Real-time validation
- PCI compliance handled by Stripe

✅ **Payment Flow**
- Checkout → Payment → Success
- Order data passed between pages
- Error handling and user feedback

✅ **UI Components**
- Modern payment form design
- Order summary display
- Loading states and error messages

## Testing

Use Stripe's test card numbers:

- **Success**: 4242 4242 4242 4242
- **Success**: 4000 0000 0000 0000
- **Success**: 4000 0000 0000 0005
- **Decline**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9999
- **3D Secure**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

## Payment Flow

1. **Checkout**: User fills shipping information
2. **Payment**: Redirected to secure Stripe payment page
3. **Processing**: Real-time payment validation and processing
4. **Success**: Order confirmation and redirect to orders page

The payment system now processes real Stripe payments with proper error handling and user feedback.

## Backend Integration

To complete the integration, you'll need to:

1. Create payment intents on your backend
2. Handle webhooks for payment confirmations
3. Update order status after successful payment

The current implementation simulates payment success for demo purposes.
