#!/bin/bash
echo "Sending Email to $1"
mail -s "Forgot Password -- Prospector" $1 <<< "Your password is $2 ,Please do not respond to this email"

