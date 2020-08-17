import hashlib
import base64
import getpass


def generate(username, website, master_password):
    b = hashlib.sha256((username + website + master_password).encode("utf-8")).digest()
    # return b.hex()
    return base64.encodebytes(b).decode("utf-8")


def main():
    username = input("Username: ")
    website = input("Website: ")
    index = input("Index: ")
    master_password = getpass.getpass("Master Password: ")
    print(generate(username + index, website, master_password))
    input()

if __name__ == "__main__":
    main()