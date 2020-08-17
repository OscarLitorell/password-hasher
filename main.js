

function toHex(buffer) {
    let b = Array.from(new Uint8Array(buffer)).reverse()
    return b.map(x => (x >> 4).toString(16) + (x & 0xF).toString(16)).join("")
}


function toBase64(buffer) {
    let b = Array.from(new Uint8Array(buffer)).reverse()
    return btoa(b.map(x => String.fromCharCode(x)).join(""))
}


function generate(login, website, master_password) {
    let h = sjcl.hash.sha256.hash(login + website + master_password)
    let data = new Int32Array(h).reverse()
 
    let b64 = toBase64(data.buffer)
    return b64
}


const usernameInput = document.getElementById("username")
const websiteInput = document.getElementById("website")
const passwordInput = document.getElementById("password")
const indexInput = document.getElementById("index")


function update() {
    let username = usernameInput.value
    let website = websiteInput.value
    let password = passwordInput.value
    let index = indexInput.value

    if (username == "" || website == "" || password == "") {
        document.getElementById("hash").innerText = ""
        return    
    }
    
    let hashed = generate(username + index, website, password)
    
    document.getElementById("hash").innerText = hashed
}

usernameInput.addEventListener("input", update)
websiteInput.addEventListener("input", update)
passwordInput.addEventListener("input", update)
indexInput.addEventListener("input", update)


