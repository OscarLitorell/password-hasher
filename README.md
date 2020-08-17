# Password Hasher

![password hasher logo](images/icon128.png "Password Hasher")

This is a program that simplifies the creation of secure passwords. Instead of having to remember several different passwords for different websites, you can generate your password on the fly with the help of *one* master password. In other words, no password is stored.

## Usage

It is actually really simple. When creating an account or logging in, simply click the extension icon and fill in your **username**, the **website name** and your **master password**. Your password for the website is generated as you type. By clicking "Fill password field", you can automatically fill in the website's password field with the generated password.

Note that your username doesn't have to be the same as your username for that website, it doesn't actually matter what your username is as long as you remember what username you used for what website (using the same username regardless might be a good idea). By going into the options for the extension, you can create a default username that will always be filled in for you (right click the icon and select options).

If your generated password has been leaked, you should enter a new value as the **index** (e.g. write 2 to indicate it's your second password) to generate a new password. If not, it should be left empty.

## Inner workings

So how does it work? In short, it simply concatenates the username (and potential index), website name and master massword and generates a SHA-256 hash from this string (the hash is expressed as base64). The reason that a username is used is that in the event of a password leak from a website's database, all users with the same master password would also have the same hash, meaning that you could see everyone who shares your password. Similarly, the website name is used since you want different passwords for different websites.

## Security

Each generated password consists of 256 bits, meaning that there are 2<sup>256</sup> combinations, or about 10<sup>77</sup>. There is a [great video](https://www.youtube.com/watch?v=S9JGmA5_unY) by 3Blue1Brown showing how large this number is.

If a website were to have all its usernames and passwords leaked, none of your other passwords would be compromised as it is effectively impossible to get the original password from the hash. An intruder would therefore have to brute force all input values to try to see which leads to the given hash. Since the hacker likely already knows your username and website, it is therefore very important to **HAVE A SECURE MASTER PASSWORD**.

## Planned features

A few things I might add in the future:

* A way to store all your logins so you know where you use this system, and also what websites share the same username and password (e.g. Google and YouTube).
* Google Drive integration (Maybe in the far future).
