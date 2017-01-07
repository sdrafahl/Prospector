Prospector is a site based off of a previous attempt with Node.js called Scrap for Cash.
Prospector covers a broader range of resources from everything from ore locations, scrap metal,
scrap electronics, surplus electronics, or whatever the user enters.

Todo:
1.Add Comments and ratings for each resources
2.Authentication for input into fields such as registering or submiting resource
3.Map and parsing through address to find a relevent location
4./sendEmail <-last thing to be done
https://nodemailer.com/
5.Forum?





Usefull Links:
https://www.codementor.io/codeforgeek/tutorials/build-website-from-scratch-using-expressjs-and-bootstrap-du107sby7
http://v4-alpha.getbootstrap.com/examples/
https://youtu.be/1x4cQnDufOc
http://www.isubookstore.com/ebook.aspx
https://www.npmjs.com/package/node-session
http://blog.modulus.io/nodejs-and-express-sessions
http://stackoverflow.com/questions/6011984/basic-ajax-send-receive-with-node-js

Email: <- probably wont be using this

password: the password
email: prospectortest@gmail.com


Note For Christian:

If you are reading this then I dont have internet. First load up Linux and then install MySQL.
After you create a user for MySQL and grant that user all privileges install Node.js. 

Next you should create a new branch on my repo on github and change your head to that new repo.

Once it get the code and Node.js is installed follow these following instructions

npm start 

When this produces errors and it says it requires a certain package try doing

sudo npm install --save

sudo npm install <Package Name>

When you finaly get it working and it says it is running on a port open a browser and enter this in the url bar

localhost:3000

Now you should be in the site. From here you should start looking at the code and try to get a basic understanding of it
and look at the todo list and see if you can get started on any of them.