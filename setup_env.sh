echo "Twilio Environment Setup"
echo "Phone Number:"
read phone_number

echo "Account SID:"
read account_sid

echo "Account Auth Token:"
read auth_token

export TWILIO_AUTH=$auth_token
export TWILIO_NUMBER=$phone_number
export TWILIO_SID=$account_sid
