import hashlib
import base64


def generate(username, website, master_password):
    b = hashlib.sha256((username + website + master_password).encode("utf-8")).digest()
    # return b.hex()
    return base64.encodebytes(b).decode("utf-8")
