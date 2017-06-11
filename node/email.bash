#!/bin/bash
echo "Sending Email to $1"
mail -s "Forgot Password -- Prospector" $1 <<< "The link to reset your password is https:www.prospector.center/resetPassword?code=$2 ,Please do not respond to this email"

